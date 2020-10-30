import * as React from 'react';
import { ToDoItem } from '../../store/Todo';
  
interface Props {
    todo: ToDoItem;
}

const TodoListItem: React.FC<Props> = props => {
    return (
        <tr data-item-id={props.todo.id}>
          <td>{props.todo.note}</td>
          <td>{props.todo.created}</td>
          <td>{props.todo.done}</td>
        </tr>
      );
  };

  export default TodoListItem;