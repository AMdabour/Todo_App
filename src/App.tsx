import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './App.css';

interface Todo {
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [Todos, setTodos] = useState<Todo[]>(() => {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(Todos));
  }, [Todos]);

  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTodos([...Todos, { text: inputValue, completed: false }]);
      setInputValue('');
    }
    setInputValue('');
  };

  const handleToggleTodo = (index: number) => {
    const newTodos = Todos.map((todo, idx) =>
      idx === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const handleRemoveTodo = (index: number) => {
    const newTodos = Todos.filter((_, idx) => idx !== index);
    setTodos(newTodos);
  };

  return (
    <div className="container">
      <h1>My Todo</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Add a new todo"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="button" type="submit">
          Add Todo
        </button>
      </form>
      <ul className="list">
        {Todos.map((todo, index) => (
          <li
            className="listItem"
            key={index}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            <span className="todoText" onClick={() => handleToggleTodo(index)}>
              {todo.text}
            </span>
            <button onClick={() => handleRemoveTodo(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
