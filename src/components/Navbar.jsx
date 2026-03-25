import "./Navbar.css";

function Navbar({ setVistaActual }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => setVistaActual("reservar")}
        >
          ZonaDeJuego
        </h2>
      </div>
      <div className="enlaces">
        <a
          href="#reservas"
          onClick={(e) => {
            e.preventDefault();
            setVistaActual("mis-reservas");
          }}
        >
          Mis Reservas
        </a>

        
        <a
          href="#catalogo"
          onClick={(e) => {
            e.preventDefault();
            setVistaActual("catalogo");
          }}
        >
          Canchas
        </a>

       <a href="#calendario" onClick={(e) => { e.preventDefault(); setVistaActual('calendario'); }}>
  Calendario
</a>
        <button className="btn-login">Iniciar Sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;
