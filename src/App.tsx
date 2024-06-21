import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import useTodoStore from './store';
import './App.css';

const App: React.FC = () => {
  const {todos, addTodo, toggleTodo, removeTodo, editTodo} = useTodoStore()
  const [inputValue, setInputValue] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo((inputValue))
      setInputValue('');
    }
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editValue.trim() && editIndex !== null) {
      editTodo(editIndex, editValue)
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleToggleTodo = (index: number) => {
    toggleTodo(index);
  };

  const handleRemoveTodo = (index: number) => {
    removeTodo(index);
  };

  const handleEditTodo = (index: number, currentText: string) => {
    setEditIndex(index);
    setEditValue(currentText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        addTodo(inputValue);
        setInputValue('');
      }
    } else if (e.key === 'Escape') {
      setInputValue('');
    } else if (e.key === 'Enter' && e.ctrlKey) {
      if (todos.length > 0) {
        handleToggleTodo(todos.length - 1);
      }
    } else if (e.key === 'Delete') {
      e.preventDefault()
      if (todos.length > 0) {
        handleRemoveTodo(todos.length - 1);
      }
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editValue.trim() && editIndex !== null) {
        editTodo(editIndex, editValue);
        setEditIndex(null);
        setEditValue('');
      }
    } else if (e.key === 'Escape') {
      setEditValue('');
    }
  };


  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (document.activeElement !== document.querySelector('.input')) {
        handleKeyDown(e as unknown as React.KeyboardEvent<HTMLInputElement>);
      }
    }

    window.addEventListener('keydown', handleKeyDownGlobal);

    return () => {
      window.removeEventListener('keydown', handleKeyDownGlobal);
    };
  }, [inputValue, todos]);

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
          onKeyDown={handleKeyDown}
        />
        <button className="button" type="submit">
          Add Todo
        </button>
      </form>
      <ul className="list">
        {todos.map((todo, index) => (
          <li className="listItem" key={index}>
            {editIndex === index ? (
              <form className="container" onSubmit={handleEditSubmit}>
                <input
                  className="input"
                  type="text"
                  value={editValue}
                  onChange={handleEditInputChange}
                  onKeyDown={handleEditKeyDown}
                />
                <button className="button" type="submit">
                  Save
                </button>
              </form>
            ) : (
              <>
                <span
                  className="todoText"
                  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                  onClick={() => handleToggleTodo(index)}
                >
                  {todo.text}
                </span>
                <button className="button" onClick={() => handleEditTodo(index, todo.text)}>
                  Edit
                </button>
                <button className="button" onClick={() => handleRemoveTodo(index)}>
                  Remove
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
