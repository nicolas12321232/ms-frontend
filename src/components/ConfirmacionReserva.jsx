import './ConfirmacionReserva.css';

function ConfirmacionReserva({ deporte, horario, cancha, alConfirmar }) {
  return (
    <div className="confirmacion-container">
      <h3>4. Resumen y Confirmación</h3>
      
      <div className="resumen-tarjeta">
        <h4>Tus datos de reserva:</h4>
        
        <ul className="lista-resumen">
          <li>
            <span>🏅 Deporte:</span> 
            <strong>{deporte === 'futbol' ? 'Fútbol ⚽' : 'Vóley 🏐'}</strong>
          </li>
          <li>
            <span>🕒 Horario:</span> 
            <strong>{horario}</strong>
          </li>
          <li>
            <span>📍 Cancha:</span> 
            <strong>{cancha.nombre} ({cancha.tipo})</strong>
          </li>
          <li className="total">
            <span>💵 Total a pagar:</span> 
            <strong>${cancha.precio.toLocaleString()}</strong>
          </li>
        </ul>

        <button 
          className="btn-confirmar-final" 
          onClick={alConfirmar}
        >
          ✅ ¡Confirmar mi Reserva!
        </button>
      </div>
    </div>
  );
}

export default ConfirmacionReserva;