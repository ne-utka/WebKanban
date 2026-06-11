import { useState, useEffect } from 'react';
import './App.css';
import ProjectForm from './AddTask';
import ProjectCard from './Task';

const DB_KEY = 'project-mgmt-db';

function makeId() {
  try {
    return typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  } catch (e) {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }
}

const STATUS = { BACKLOG: 'backlog', PROGRESS: 'progress', DONE: 'done' };

export default function App() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Array.isArray(data)) setProjects(data);
      } catch (e) {
        setProjects([]);
      }
    }
  }, []);

  useEffect(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status !== STATUS.DONE).length;
    const completed = projects.filter((p) => p.status === STATUS.DONE).length;
    setStats({ total, active, completed });
    localStorage.setItem(DB_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (title, desc) => {
    if (title.trim()) {
      const newProj = { id: makeId(), title, desc: desc || '', status: STATUS.BACKLOG, created: new Date().toLocaleDateString() };
      setProjects((s) => [...s, newProj]);
    }
  };

  const updateStatus = (id, newStatus) => setProjects((s) => s.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));

  const removeProject = (id) => setProjects((s) => s.filter((p) => p.id !== id));

  const byStatus = (st) => projects.filter((p) => p.status === st);

  return (
    <div className="workspace">
      <header className="header">
        <h1 className="title">Project Board</h1>
        <div className="stats-line">
          <span className="stat">Всего: {stats.total}</span>
          <span className="stat">В работе: {stats.active}</span>
          <span className="stat">Завершено: {stats.completed}</span>
        </div>
      </header>
      
      <ProjectForm onAdd={addProject} />
      
      <div className="columns-container">
        <div className="column">
          <h2 className="col-header">Новое</h2>
          <div className="card-list">
            {byStatus(STATUS.BACKLOG).map((p) => (
              <ProjectCard key={p.id} project={p} onStatus={updateStatus} onDelete={removeProject} />
            ))}
          </div>
        </div>
        
        <div className="column">
          <h2 className="col-header">В процессе</h2>
          <div className="card-list">
            {byStatus(STATUS.PROGRESS).map((p) => (
              <ProjectCard key={p.id} project={p} onStatus={updateStatus} onDelete={removeProject} />
            ))}
          </div>
        </div>
        
        <div className="column">
          <h2 className="col-header">Готово</h2>
          <div className="card-list">
            {byStatus(STATUS.DONE).map((p) => (
              <ProjectCard key={p.id} project={p} onStatus={updateStatus} onDelete={removeProject} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}