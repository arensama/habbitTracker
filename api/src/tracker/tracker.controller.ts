import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/dto/req.interface';
import { TrackerService } from './tracker.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createTrackerDto: CreateTrackerDto,
  ) {
    return this.trackerService.create(req.user, createTrackerDto);
  }
  @Get('active')
  getActive(@Req() req: RequestWithUser) {
    return this.trackerService.getActive(req.user);
  }
  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.trackerService.findAll(req.user);
  }
  @Get('home')
  home(@Req() req: RequestWithUser) {
    return this.trackerService.home(req.user);
  }
  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.trackerService.findOne(req.user, id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateTrackerDto: UpdateTrackerDto,
  ) {
    return this.trackerService.update(req.user, id, updateTrackerDto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.trackerService.remove(req.user, id);
  }
  @Post('add')
  addnew(
    @Req() req: RequestWithUser,
    @Body() createTrackerDto: CreateTrackerDto,
  ) {
    return this.trackerService.addnew(req.user, createTrackerDto);
  }

  @Post('end')
  endTracker(@Req() req: RequestWithUser) {
    return this.trackerService.endTracker(req.user);
  }
}
