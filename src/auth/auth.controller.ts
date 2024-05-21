import { Controller, Post, Body, UnauthorizedException, Logger, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body('email') email: string, @Body('password') password: string) {
     // Check if user with the given email already exists
     const userExists = await this.authService.findByEmail(email);
     if (userExists) {
       throw new ConflictException('Email already exists', 'EmailAlreadyExists');
       // Or you can throw a generic conflict exception:
       // throw new ConflictException();
     }
    const user = await this.authService.signUp(email, password);
    this.logger.log(`User ${email} signed up`);
    return user;
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user:any = await this.authService.validateUser(email, password);
    if (!user) {
      this.logger.warn(`Invalid login attempt for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }


    // If user is not found or password is incorrect
    if (!user) {
      this.logger.warn(`Invalid login attempt for ${email}`);
      throw new UnauthorizedException('Invalid email or password', 'InvalidCredentials');
      // Or you can throw a generic unauthorized exception:
      // throw new UnauthorizedException();
    }

    const payload = { email: user.email, sub: user._id };
    this.logger.log(`User ${email} logged in`);
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
}
