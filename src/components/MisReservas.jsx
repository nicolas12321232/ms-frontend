import './MisReservas.css';

function MisReservas() {
  
  const reservasMock = [
    { id: 101, fecha: '28 de Octubre, 2023', hora: '19:00', cancha: 'Cancha Los Pinos', deporte: 'Fútbol ⚽', estado: 'Próxima', precio: 50000 },
    { id: 102, fecha: '20 de Octubre, 2023', hora: '18:00', cancha: 'Arena Vóley Sur', deporte: 'Vóley 🏐', estado: 'Completada', precio: 40000 },
    { id: 103, fecha: '15 de Octubre, 2023', hora: '20:00', cancha: 'El Campín Pequeño', deporte: 'Fútbol ⚽', estado: 'Cancelada', precio: 120000 },
  ];

  return (
    <div className="mis-reservas-container">
      <h2>📅 Mis Reservas</h2>
      <p>Aquí puedes ver tu historial de partidos y tus próximas reservas.</p>

      <div className="lista-reservas">
        {reservasMock.map((reserva) => (
          <div key={reserva.id} className={`tarjeta-reserva ${reserva.estado.toLowerCase()}`}>
            <div className="reserva-header">
              <span className="reserva-id">Reserva #{reserva.id}</span>
             
              <span className={`badge-estado ${reserva.estado.toLowerCase()}`}>
                {reserva.estado}
              </span>
            </div>
            
            <div className="reserva-body">
              <div className="reserva-info">
                <h4>{reserva.cancha}</h4>
                <p><strong>Deporte:</strong> {reserva.deporte}</p>
                <p><strong>Fecha:</strong> {reserva.fecha} a las {reserva.hora}</p>
              </div>
              <div className="reserva-precio">
                <p>Total pagado</p>
                <h3>${reserva.precio.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisReservas;