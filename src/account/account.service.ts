import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    if (
      await this.accountRepository.findOne({
        where: { username: createAccountDto.username },
      })
    )
      throw new BadRequestException('Username already taken');

    const user = this.accountRepository.create({ ...createAccountDto });
    await this.accountRepository.save(user);
    return user;
  }

  async findAll() {
    return await this.accountRepository.find();
  }

  async findOne(id: number) {
    return await this.accountRepository.findOne({
      where: { id },
    });
  }

  async findByUsername(
    username: string,
    withPassword = false,
  ): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: withPassword,
      },
    });
  }

  remove(id: number) {
    return this.accountRepository.delete({ id });
  }
}
