import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as TodoStore from '../../store/Todo';
import AddTodoForm from './AddTodoForm';
import TodoListItem from './TodoListItem';

type ToDoProps = TodoStore.ToDoListState
  & typeof TodoStore.actionCreators
  & RouteComponentProps<{ done?: string }>;


class ToDoListData extends React.PureComponent<ToDoProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">To Do List</h1>
        <p>Todo List</p>
        {this.renderTodoList()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    const completed = this.props.match.params.done === 'yes';
    this.props.requestTodos(completed);
  }

  private addTodo(text: string) {
    if (!this.isEmptyTodo(text)) {
      const todo = this.getNewTodoItem(text);
      this.props.createTodos(todo);
    }
  }

  private getNewTodoItem(text: string) {
    const todo: TodoStore.ToDoItem = {
      note: text,
      done: false,
      created: new Date().toISOString(),
    };
    return todo;
  }

  private isEmptyTodo(text: string) {
    return text && text.trim() === ''
  }

  private renderTodoList() {
    return (
      <React.Fragment>
        <AddTodoForm addTodo={(text: string) => this.addTodo(text)} />
        <table className='table table-striped' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Note</th>
              <th>Created</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody>
            {this.props.todos.map((todo: TodoStore.ToDoItem) =>
              <TodoListItem key={todo.id} todo={todo} />
            )}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.todos,
  TodoStore.actionCreators
)(ToDoListData as any);
