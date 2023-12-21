import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { SequelizeModule } from '@nestjs/sequelize';
import * as LocalSession from 'telegraf-session-local';
import { Task } from './models/task.model';

const sessions = new LocalSession({ database: 'session.db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: '6327132520:AAFV5SqSOYaX0kFqmI7ilbHoyfB2rGK8nww',
    }),

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'todo-app-tg-bot',
      username: 'postgres',
      password: 'N1357=Dt',
      models: [Task],
      synchronize: true,
      autoLoadModels: true,
    }),
    SequelizeModule.forFeature([Task]),
  ],
  controllers: [],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
