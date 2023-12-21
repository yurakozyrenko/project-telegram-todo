import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface TaskCreationAttrs {
  name: string;
  isCompleted: boolean;
}

@Table({ tableName: 'Task' })
export class Task extends Model<Task, TaskCreationAttrs> {
    
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  //

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
  })
  name: string;
  //

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isCompleted: boolean;
  //

  //
}
