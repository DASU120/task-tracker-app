// frontend/src/components/TaskList.js
import React, { useState, useEffect, useCallback } from 'react';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sort, setSort] = useState('');

  const fetchTasks = useCallback(async () => {
    let url = 'https://task-tracker-app-fyxg.onrender.com/tasks';
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);
    if (sort) params.append('sort', sort);

    if (params.toString()) url += '?' + params.toString();

    try {
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  }, [statusFilter, priorityFilter, sort]); 

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`https://task-tracker-app-fyxg.onrender.com/tasks/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Re-fetch to update list
        fetchTasks();
      } else {
        const error = await res.json().catch(() => ({}));
        alert('Failed to delete task: ' + (error.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error while deleting task.');
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await fetch(`https://task-tracker-app-fyxg.onrender.com/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => (t.id === updated.id ? updated : t)));
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  // Fetch tasks when filters/sort change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); 

  return (
    <div className="task-list-container">
      <div className="filters">
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select onChange={(e) => setPriorityFilter(e.target.value)} value={priorityFilter}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="">No Sort</option>
          <option value="due_date">Due Date (Soonest)</option>
        </select>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="meta">
              <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span>Due: {task.due_date}</span>
              <span>Status: {task.status}</span>
            </div>
            <div className="actions">
              {task.status !== 'Done' && (
                <button onClick={() => updateTask(task.id, { status: 'Done' })}>Mark Done</button>
              )}
              {task.status !== 'In Progress' && task.status !== 'Done' && (
                <button onClick={() => updateTask(task.id, { status: 'In Progress' })}>Start</button>
              )}
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, { priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;