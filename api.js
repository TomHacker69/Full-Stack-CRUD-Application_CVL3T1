import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/tasks';

export const taskAPI = {
  // CREATE
  createTask: (title) => 
    axios.post(API_BASE, { title, completed: false }),
  
  // READ
  getAllTasks: () => 
    axios.get(API_BASE),
  
  // UPDATE
  updateTask: (id, data) => 
    axios.put(`${API_BASE}/${id}`, data),
  
  // DELETE
  deleteTask: (id) => 
    axios.delete(`${API_BASE}/${id}`)
};