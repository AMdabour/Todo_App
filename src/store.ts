import create from 'zustand';

interface Todo {
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (index: number) => void;
  removeTodo: (index: number) => void;
  editTodo: (index: number, text: string) => void;
}

const useTodoStore = create<TodoState>((set) => ({
  todos: JSON.parse(localStorage.getItem('todos') || '[]'),
  addTodo: (text) => set((state) => {
    const newTodos = [...state.todos, { text, completed: false }];
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return { todos: newTodos };
  }),
  toggleTodo: (index) => set((state) => {
    const newTodos = state.todos.map((todo, idx) =>
      idx === index ? { ...todo, completed: !todo.completed } : todo
    );
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return { todos: newTodos };
  }),
  removeTodo: (index) => set((state) => {
    const newTodos = state.todos.filter((_, idx) => idx !== index);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return { todos: newTodos };
  }),
  editTodo: (index, text) => set((state) => {
    const newTodos = state.todos.map((todo, idx) =>
      idx === index ? { ...todo, text } : todo
    );
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return { todos: newTodos };
  }),
}));

export default useTodoStore;
