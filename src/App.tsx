import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { useTranslation } from 'react-i18next';
import { addTodo, toggleTodo, removeTodo, editTodo, saveTodos } from './store/todosSlice';
import './i18n'
import './App.css';

const App: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch: AppDispatch = useDispatch();

  const [t, i18n] = useTranslation()
  const [inputValue, setInputValue] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    dispatch(saveTodos());
  }, [todos, dispatch]);

  useEffect(() => {
    document.body.dir = t('direction');
  }, [t])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(addTodo(inputValue));
      setInputValue('');
    }
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editValue.trim() && editIndex !== null) {
      dispatch(editTodo({ index: editIndex, text: editValue }));
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleToggleTodo = (index: number) => {
    dispatch(toggleTodo(index));
  };

  const handleRemoveTodo = (index: number) => {
    dispatch(removeTodo(index));
  };

  const handleEditTodo = (index: number, currentText: string) => {
    setEditIndex(index);
    setEditValue(currentText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        dispatch(addTodo(inputValue));
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
        dispatch(editTodo({ index: editIndex, text: editValue }));
        setEditIndex(null);
        setEditValue('');
      }
    } else if (e.key === 'Escape') {
      setEditValue('');
    }
  };

  const switchLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  }

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
      <button onClick={switchLanguage}>{t('switchLanguage')}</button>
      <h1>{t('title')}</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          className="input"
          type="text"
          placeholder={t('placeholder')}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="button" type="submit">
          {t('addButton')}
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
                  {t('saveButton')}
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
                  {t('editButton')}
                </button>
                <button className="button" onClick={() => handleRemoveTodo(index)}>
                  {t('removeButton')}
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
