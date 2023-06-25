import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Account } from 'src/account/entities/account.entity';
import { AccessTokenDto } from './dto/accessToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly profileService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async register(profile: CreateAccountDto) {
    const password = await AuthService.hashPassword(profile.password);
    return this.profileService.create({ ...profile, password });
  }

  async login(loginDto: LoginDto): Promise<AccessTokenDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    const payload = { username: user.username, id: user.id, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(id: number): Promise<Account> {
    const profile = await this.profileService.findOne(id);
    if (!profile) throw new NotFoundException();
    return profile;
  }

  static SALT_ROUND = 10;

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.profileService.findByUsername(username, true);
    if (!user)
      throw new NotFoundException(
        `User with username: '${username}' not existing`,
      );

    const isPasswordMatch = await AuthService.comparePasswords(
      pass,
      user.password,
    );

    if (!isPasswordMatch) throw new UnauthorizedException();

    return {
      id: user.id,
      username: user.username,
    };
  }

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, AuthService.SALT_ROUND);
  }

  static async comparePasswords(
    requestPassword: string,
    dbHashedPassword: string,
  ) {
    return await bcrypt.compare(requestPassword, dbHashedPassword);
  }
}
