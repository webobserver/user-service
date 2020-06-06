import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model } from 'mongoose';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as config from 'config';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async registerUser({ email, password }: UserDto) {
    password = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
    await new this.userModel({
      email,
      hashedPassword: password,
    }).save();
  }
  async findUser({ email }: UserDto): Promise<User> {
    return this.userModel.findOne({ email });
  }
  async validateUser(userInfo: UserDto): Promise<User | undefined> {
    const user = await this.findUser(userInfo);
    if (
      user &&
      (await bcrypt.compare(userInfo.password, user.hashedPassword))
    ) {
      return user;
    }
  }

  async signToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ userId: userId });
  }
}
