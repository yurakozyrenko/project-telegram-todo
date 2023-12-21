export const showList = (todos) =>
  `Твой список задач: \n\n${todos
    .map(
      (todo) =>
        (todo.isCompleted ? '✔️' : '⭕') + ' ' + 'id:' +  todo.id + ' ' + todo.name + '\n\n',
    )
    .join('')}`;
