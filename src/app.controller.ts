import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@Controller()
@ApiTags('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  @ApiBadRequestResponse({
    description: 'Bad request body or user already exists',
  })
  @ApiCreatedResponse()
  async registerUser(@Body() newUser: UserDto): Promise<void> {
    if (await this.appService.findUser(newUser))
      throw new BadRequestException('Already exists');
    return this.appService.registerUser(newUser);
  }
  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Credentials are valid and token is returned',
    type: String,
  })
  @ApiBadRequestResponse({
    description: 'Wrong request body or no user match provided credentials',
  })
  async loginUser(@Body() requested: UserDto): Promise<string> {
    const user = await this.appService.validateUser(requested);
    if (!user)
      throw new BadRequestException(
        'Following credentials does not match any user',
      );
    return this.appService.signToken(user._id);
  }
}
