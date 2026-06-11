import { useState } from 'react';

export default function ProjectForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(title, desc);
    setTitle('');
    setDesc('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название проекта..."
        className="input-title"
        type="text"
      />
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Описание (опционально)..."
        className="input-desc"
      />
      <button type="submit" className="btn-create">Создать</button>
    </form>
  );
}
