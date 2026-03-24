
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>⚽ CanchaConnect</h2>
      </div>
      <div className="enlaces">
        <a href="#reservas">Mis Reservas</a>
        <a href="#canchas">Canchas</a>
        <a href="#canchas">Calendario</a>
        <button className="btn-login">Iniciar Sesión</button>
      </div>
    </nav>
  );
}

export default Navbar; 