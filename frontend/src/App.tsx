import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input }),
      });
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInput('');
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await fetch(`${BACKEND_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      const updated = await res.json();
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`${BACKEND_URL}/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '40px 20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      <div style={{ 
        maxWidth: '550px', 
        margin: '0 auto', 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <h2 style={{ 
          margin: '0 0 24px 0', 
          color: '#1e293b', 
          fontSize: '28px', 
          fontWeight: 700,
          textAlign: 'center'
        }}>
          Task Manager
        </h2>
        
        <form onSubmit={addTodo} style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="What needs to be done?" 
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: '#f8fafc'
            }}
          />
          <button type="submit" style={{ 
            padding: '12px 24px', 
            borderRadius: '8px', 
            border: 'none',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            Add Task
          </button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {todos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '15px' }}>No tasks yet. Add one above!</p>
          ) : (
            todos.map(todo => (
              <li key={todo.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px', 
                marginBottom: '12px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#4f46e5'
                    }}
                  />
                  <span style={{ 
                    fontSize: '16px',
                    color: todo.completed ? '#94a3b8' : '#334155',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    wordBreak: 'break-word',
                    userSelect: 'none'
                  }}>
                    {todo.title}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTodo(todo.id)} 
                  style={{ 
                    background: 'none', 
                    color: '#ef4444', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '14px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;