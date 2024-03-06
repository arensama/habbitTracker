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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/dto/req.interface';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(req.user, createTaskDto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.taskService.findAll(req.user);
  }

  @Get('summery')
  summery(@Req() req: RequestWithUser) {
    return this.taskService.summery(req.user);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.taskService.findOne(req.user, id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(req.user, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.taskService.remove(req.user, id);
  }
  @Post('mock')
  mock(@Req() req: RequestWithUser) {
    return this.taskService.mock(req.user);
  }
}
