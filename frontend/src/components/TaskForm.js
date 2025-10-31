// frontend/src/components/TaskForm.js
import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 Critical: prevent page reload

    // Validate on frontend too
    if (!title.trim() || !dueDate) {
      alert('Title and Due Date are required.');
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate, // This is already YYYY-MM-DD from <input type="date">
    };

    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (res.ok) {
        const task = await res.json();
        onTaskCreated?.();

        // Reset form
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setDueDate('');
      } else {
        const err = await res.json();
        alert('Failed to create task: ' + (err.error || 'Unknown error'));
        console.error('Backend error:', err);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Is the backend running?');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;