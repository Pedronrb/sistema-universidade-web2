export default function Card({ title, icon, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <span className="card-icon">{icon}</span>
      <h3>{title}</h3>
    </div>
  );
}
