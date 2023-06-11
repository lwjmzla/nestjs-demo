import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule], // !nest g module user 自动创建并引入了
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
