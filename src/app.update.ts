import { AppService } from './app.service';
import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from './context.interface';
import { actionButtons } from './buttons/app.buttons';
import { showList } from './utils/app.utils';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Привет! Friend 🤙');
    await ctx.reply(
      'Добро пожаловать! \n\n Что ты хочешь сделать?',
      actionButtons(),
    );
  }
  @Hears('Создать задачу')
  async createTask(ctx: Context) {
    ctx.session.type = 'create';
    await ctx.reply('✏️ Твоя задача: ');
  }

  @Hears('Список задач')
  async listTask(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears('Завершить')
  async doneTask(ctx: Context) {
    await ctx.reply('✏️ Напиши ID задачи: ');
    ctx.session.type = 'done';
  }

  @Hears('Редактирование')
  async editTask(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      '✏️ Напиши id задачи и новое название задачи: \n\n' +
        'В формате - <b>1, Новое название </b> ',
    );
  }

  @Hears('Удаление')
  async deleteTask(ctx: Context) {
    ctx.session.type = 'remove';
    await ctx.reply('✏️Напиши ID задачи: ');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) {
      return;
    }

    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(Number(message));

      if (!todos) {
        await ctx.reply('Задачи с таким id не найдено! \n\n Попробуй еще раз!');
        return;
      }
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message);
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(', ');
      if (!taskId || !taskName) {
        await ctx.reply('Неверный ввод данных! \n\n Попробуй еще раз!');
        return;
      }
      const todos = await this.appService.editTask(Number(taskId), taskName);

      if (!todos) {
        await ctx.reply('Задачи с таким id не найдена! \n\n Попробуй еще раз!');
        return;
      }
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'remove') {
      const todos = await this.appService.deleteTask(Number(message));

      if (!todos) {
        await ctx.reply('Задачи с таким id не найдено! \n\n Попробуй еще раз!');
        return;
      }
      await ctx.reply(showList(todos));
    }
  }
}
