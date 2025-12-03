import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import '../styles/TaskManager.css';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await taskAPI.createTask(newTask);
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await taskAPI.updateTask(task._id, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await taskAPI.updateTask(id, { title: editText });
      setTasks(tasks.map(t => t._id === id ? response.data : t));
      setEditingId(null);
    } catch (error) {
      console.error('Error editing task:', error);
      alert('Failed to edit task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
        <p>Full-Stack CRUD Application</p>
      </header>

      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="filter-section">
        {['all', 'pending', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'active' : ''}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="empty">No tasks found</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map(task => (
            <li key={task._id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
              {editingId === task._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(task._id)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(task._id)}
                  autoFocus
                  className="edit-input"
                />
              ) : (
                <span
                  onClick={() => {
                    setEditingId(task._id);
                    setEditText(task.title);
                  }}
                  className={task.completed ? 'completed' : ''}
                >
                  {task.title}
                </span>
              )}
              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="stats">
        <div className="stat">
          <p className="number">{tasks.length}</p>
          <p className="label">Total</p>
        </div>
        <div className="stat">
          <p className="number">{tasks.filter(t => t.completed).length}</p>
          <p className="label">Completed</p>
        </div>
        <div className="stat">
          <p className="number">{tasks.filter(t => !t.completed).length}</p>
          <p className="label">Pending</p>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;