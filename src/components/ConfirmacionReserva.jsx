import { useState } from 'react';
import './ConfirmacionReserva.css';

function ConfirmacionReserva({ deporte, horarios, cancha, alConfirmar }) {
  const [guardando, setGuardando] = useState(false);

  const manejarEnvio = async () => {
    setGuardando(true);
    const hoy = new Date().toISOString().split('T')[0];

    try {
      const url = `${import.meta.env.VITE_API_URL}/reservas`;

      for (const hora of horarios) {
        // Calculamos la hora de fin sumando 1, pero SIN segundos (ej. "13:00")
        const horaFinCalculada = `${String(parseInt(hora.split(':')[0]) + 1).padStart(2, '0')}:00`;

        // Armamos el objeto EXACTAMENTE como lo pide tu Reserva.java
        const nuevaReserva = {
          fechaReserva: hoy,
          horaInicio: hora,              // Mandamos "12:00" directo, sin los segundos
          horaFin: horaFinCalculada,     // Mandamos "13:00", sin los segundos
          precioTotal: cancha.precioPorHora || 0, // Mandamos el precio de 1 sola hora por cada ciclo
          usuarioId: "cliente-anonimo",  // Es String en Java, así que esto está perfecto
          estado: "CONFIRMADA",
          cancha: { 
            id: cancha.id 
          } 
        };

        const respuesta = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevaReserva)
        });

        if (!respuesta.ok) {
          throw new Error(`Error al guardar la reserva de las ${hora}`);
        }
      }

      // Si el FOR termina sin problemas, todas las horas se guardaron
      alConfirmar(); 

    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      alert("Hubo un problema procesando las reservas. Revisa la consola o tu historial.");
    } finally {
      setGuardando(false);
    }
  };

  // Calculamos el precio total real para mostrarlo visualmente al cliente
  const precioTotal = (cancha.precioPorHora || 0) * horarios.length;

  return (
    <div className="confirmacion-container">
      <h3>4. Resumen y Confirmación</h3>
      
      <div className="resumen-tarjeta">
        <h4>Tus datos de reserva:</h4>
        
        <ul className="lista-resumen">
          <li>
            <span>🏅 Deporte:</span> 
            <strong>{deporte}</strong>
          </li>
          <li>
            <span>🕒 Horarios:</span> 
            <strong>{horarios.join(" - ")}</strong>
          </li>
          <li>
            <span>📍 Cancha:</span> 
            <strong>{cancha.nombre} ({cancha.tipo})</strong>
          </li>
          <li className="total">
            <span>💵 Total a pagar ({horarios.length} hrs):</span> 
            <strong>${precioTotal.toLocaleString()}</strong>
          </li>
        </ul>

        <button 
          className="btn-confirmar-final" 
          onClick={manejarEnvio}
          disabled={guardando}
          style={{ 
            opacity: guardando ? 0.7 : 1, 
            cursor: guardando ? 'not-allowed' : 'pointer' 
          }}
        >
          {guardando ? '⏳ Procesando reserva...' : '✅ ¡Confirmar mi Reserva!'}
        </button>
      </div>
    </div>
  );
}

export default ConfirmacionReserva;