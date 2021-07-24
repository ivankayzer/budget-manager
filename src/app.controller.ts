import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return { message: this.appService.getHello() };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/protected')
  getProtectedHello(): { message: string } {
    return {
      message: 'Hello, you are authenticated.',
    };
  }
}
