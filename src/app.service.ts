import { Injectable } from '@nestjs/common';
import { Task } from './models/task.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AppService {
  constructor(@InjectModel(Task) private taskRepository: typeof Task) {}

  async getAll() {
    return await this.taskRepository.findAll();
  }

  async getOneById(id: number) {
    return this.taskRepository.findOne({ where: { id } });
  }

  async createTask(name: string) {
    const task = await this.taskRepository.create({ name });
    console.log(task);
    return this.getAll();
  }

  async doneTask(id: number) {
    const task = await this.getOneById(id);
    if (!task) {
      return null;
    }

    const response: boolean = !task.isCompleted;
    await this.taskRepository.update(
      { isCompleted: response },
      { where: { id } },
    );
    return this.getAll();
  }

  async editTask(id: number, name: string) {
    const task = await this.getOneById(id);
    if (!task) {
      return null;
    }
    const response: string = name;
    await this.taskRepository.update({ name: response }, { where: { id } });
    return this.getAll();
  }

  async deleteTask(id: number) {
    const task = await this.getOneById(id);
    if (!task) {
      return null;
    }
    await this.taskRepository.destroy({ where: { id } });
    return this.getAll();
  }
}
