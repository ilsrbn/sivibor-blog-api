import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Account } from 'src/account/entities/account.entity';
import { User } from '../../utils/request.decorators';

@ApiTags('Admin Authorization')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiOperation({ summary: 'Register profile' })
  // @Post('register')
  // register(@Body() createAccountDto: CreateAccountDto) {
  //   return this.authService.register(createAccountDto);
  // }

  @ApiOperation({ summary: 'login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Get logged in profile' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@User() userId: number): Promise<Account> {
    return this.authService.getProfile(userId);
  }
}
