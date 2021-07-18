import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from '../auth/body-with-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAnalytics(@BodyWithUserId() dto: UserDto) {}
}
