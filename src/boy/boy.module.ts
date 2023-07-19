import { Module } from '@nestjs/common';
import { BoyService } from './boy.service';
import { BoyController } from './boy.controller';

@Module({
  controllers: [BoyController],
  providers: [BoyService],
  //exports:[BoyService] // !在user.controller.ts中使用boy.service.ts中的方法 局部引入模块，这里不需要导出
})
export class BoyModule {}
