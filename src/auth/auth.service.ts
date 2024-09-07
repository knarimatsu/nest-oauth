import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';

export interface SignInResponse {
  access_token: string;
}

export interface SignUpResponse {
  message: string;
  status: number;
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * signIn
   */
  async signIn(username: string, pass: string): Promise<SignInResponse> {
    const user = await this.userService.findOne(username);
    const result: boolean = await bcrypt.compare(pass, user.password);
    if (!result) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createUser(username: string, password: string): Promise<User> {
    const params: Prisma.UserCreateInput = {
      username,
      password: bcrypt.hashSync(password, 10),
    };
    return await this.prisma.user.create({
      data: params,
    });
  }

  async updateUser(
    params: { where: Prisma.UserWhereUniqueInput },
    username: string,
    password: string,
  ) {
    const { where } = params;
    const data: Prisma.UserUpdateInput = {
      username,
      password: bcrypt.hashSync(password, 10),
    };
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteuser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
