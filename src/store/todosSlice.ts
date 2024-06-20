import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Todo {
    text: string,
    completed: boolean
}

interface TodosState {
    todos: Todo[]
}

const initialState: TodosState = {
    todos: JSON.parse(localStorage.getItem('todos') || '[]')
}


const todosSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {
            state.todos.push({text: action.payload, completed: false});
        },
        removeTodo: (state, action: PayloadAction<number>) => {
            state.todos.splice(action.payload, 1);
        },
        toggleTodo: (state, action: PayloadAction<number>) => {
            const todo = state.todos[action.payload];
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        editTodo: (state, action: PayloadAction<{index: number, text: string}>) => {
            const todo = state.todos[action.payload.index];
            if (todo) {
                todo.text = action.payload.text;
            }
        },
        saveTodos: (state) => {
            localStorage.setItem('todos', JSON.stringify(state.todos));
        }
    }
});

export const {addTodo, removeTodo, editTodo, toggleTodo, saveTodos} = todosSlice.actions;
export default todosSlice.reducer
