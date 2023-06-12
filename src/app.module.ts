import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule], // !nest g module user 自动创建并引入了
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
