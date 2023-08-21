import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
