import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

export interface ToDoListState {
    isLoading: boolean;
    completed: boolean;
    todos: ToDoItem[];
}

export interface ToDoItem {
    id?: string;
    note: string;
    done: boolean;
    created: string;
}

interface RequestToDosAction {
    type: 'REQUEST_TODOS';
}

interface ReceiveToDosAction {
    type: 'RECEIVE_TODOS';
    todos: ToDoItem[];
}

interface UpdateToDosAction {
    type: 'UPDATE_TODOS';
    todo: ToDoItem;
}

type KnownAction = RequestToDosAction | ReceiveToDosAction | UpdateToDosAction;

export const actionCreators = {
    requestTodos: (completed: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        console.log(completed);
        if (appState && appState.todos && appState.todos.completed === completed) {
            fetch('http://localhost:3600/todos')
            .then(response => response.json() as Promise<ToDoItem[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_TODOS', todos: data });
            });

            dispatch({ type: 'REQUEST_TODOS' });
        }  
    },
    createTodos: (todoItem: ToDoItem): AppThunkAction<KnownAction> => (dispatch, getState) => {
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(todoItem)
        };
        fetch('http://localhost:3600/todos', options)
        .then(response => response.json() as Promise<ToDoItem>)
        .then(data => {
            todoItem['id'] = data.id;
            dispatch({ type: 'UPDATE_TODOS', todo:  todoItem});
        });
    }
};

const unloadedState: ToDoListState = { todos: [], completed: false, isLoading: false };

export const reducer: Reducer<ToDoListState> = (state: ToDoListState | undefined, incomingAction: Action): ToDoListState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_TODOS':
            return {
                todos: state.todos,
                completed: false,
                isLoading: true
            };
        case 'RECEIVE_TODOS':
            return {
                todos: action.todos,
                completed:  false,
                isLoading: false
            };
        case 'UPDATE_TODOS':
            return {
                todos: [...state.todos, action.todo],
                completed: false,
                isLoading: false
            };
        default:
            return state;
    } 
};
