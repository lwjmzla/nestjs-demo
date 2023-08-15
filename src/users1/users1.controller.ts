import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Users1Service } from './users1.service';
import { CreateUsers1Dto } from './dto/create-users1.dto';
import { UpdateUsers1Dto } from './dto/update-users1.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { AdminGuard } from 'src/guard/admin.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('users1')
@UseGuards(JwtGuard)  // !可以放在controller层、全局等
export class Users1Controller {
  constructor(private readonly users1Service: Users1Service) {}

  @Post()
  create(@Body() createUsers1Dto: CreateUsers1Dto) {
    return this.users1Service.create(createUsers1Dto);
  }

  //@Public()
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.users1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsers1Dto: UpdateUsers1Dto) {
    return this.users1Service.update(+id, updateUsers1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.users1Service.remove(+id);
  }
}
