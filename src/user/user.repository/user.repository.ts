import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public async findByUsername(
    username: string,
  ): Promise<UserEntity | undefined> {
    return this.userRepo.findOne({ where: { username } });
  }

  /**
   * createUser
   */
  public async createUser(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const user = this.userRepo.create({ username, password });
    return this.userRepo.save(user);
  }

  /**
   * save
   * 単なる保存
   */
  public async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepo.save(user);
  }
}
