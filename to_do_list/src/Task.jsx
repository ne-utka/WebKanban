export default function ProjectCard({ project, onStatus, onDelete }) {
  const getNext = () => {
    if (project.status === 'backlog') return 'progress';
    if (project.status === 'progress') return 'done';
    return 'backlog';
  };

  return (
    <div className="card">
      <h3 className="card-title">{project.title}</h3>
      {project.desc && <p className="card-desc">{project.desc}</p>}
      <div className="card-meta">{project.created}</div>
      <div className="card-actions">
        <button className="btn-action" onClick={() => onStatus(project.id, getNext())}>Далее</button>
        <button className="btn-remove" onClick={() => onDelete(project.id)}>Удалить</button>
      </div>
    </div>
  );
}