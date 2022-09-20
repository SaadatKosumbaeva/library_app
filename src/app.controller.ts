import { Response } from 'express';
import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health-check')
  healthcheck(@Res() res: Response) {
    res.send().status(200);
  }
}