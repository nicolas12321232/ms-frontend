import { useState, useEffect } from 'react';
import './MisReservas.css';

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/reservas`;
        const respuesta = await fetch(url);

        if (respuesta.ok) {
          const datos = await respuesta.json();
          setReservas(datos);
        } else {
          throw new Error("El endpoint de reservas aún no responde");
        }
      } catch (error) {
        console.log("Aviso: Cargando reservas de prueba (Backend no disponible)");
        // 👇 AQUÍ AJUSTAMOS LOS NOMBRES PARA QUE COINCIDAN CON JAVA
        setReservas([
          { 
            id: 101, fechaReserva: '2023-10-28', horaInicio: '19:00', estado: 'Próxima', precioTotal: 50000,
            cancha: { nombre: 'Cancha Los Pinos', deporte: { nombre: 'Futbol' } } 
          },
          { 
            id: 102, fechaReserva: '2023-10-20', horaInicio: '18:00', estado: 'Completada', precioTotal: 40000,
            cancha: { nombre: 'Arena Vóley Sur', deporte: { nombre: 'Voley' } } 
          },
          { 
            id: 103, fechaReserva: '2023-10-15', horaInicio: '20:00', estado: 'Cancelada', precioTotal: 120000,
            cancha: { nombre: 'El Campín Pequeño', deporte: { nombre: 'Futbol' } } 
          },
        ]);
      } finally {
        setCargando(false);
      }
    };

    obtenerReservas();
  }, []);

  // --- NUEVA FUNCIÓN PARA CANCELAR ---
  const cancelarReserva = async (idReserva) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
      const url = `${import.meta.env.VITE_API_URL}/reservas/${idReserva}`;
      const respuesta = await fetch(url, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        setReservas(reservas.filter(reserva => reserva.id !== idReserva));
        alert("Reserva cancelada con éxito. 🗑️");
      } else {
        alert("Hubo un problema al intentar cancelar la reserva en el servidor.");
      }
    } catch (error) {
      console.error("Error al cancelar:", error);
      setReservas(reservas.filter(reserva => reserva.id !== idReserva));
      alert("(Modo Prueba) Reserva removida de la pantalla.");
    }
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no definida';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(fechaString + "T00:00:00"); 
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const obtenerIcono = (nombreDeporte) => {
    if (!nombreDeporte) return '🏅';
    const nombre = nombreDeporte.toLowerCase();
    if (nombre.includes('futbol') || nombre.includes('fútbol')) return '⚽';
    if (nombre.includes('voley') || nombre.includes('voleibol')) return '🏐';
    return '🏅';
  };

  if (cargando) {
    return (
      <div className="mis-reservas-container">
        <h2>📅 Mis Reservas</h2>
        <p>Cargando tu historial de reservas...</p>
      </div>
    );
  }

  return (
    <div className="mis-reservas-container">
      <h2>📅 Mis Reservas</h2>
      <p>Aquí puedes ver tu historial de partidos y tus próximas reservas.</p>

      {reservas.length === 0 ? (
        <div className="mensaje-vacio" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
          <h3>Aún no tienes reservas</h3>
          <p>¡Anímate a reservar tu primera cancha!</p>
        </div>
      ) : (
        <div className="lista-reservas">
          {reservas.map((reserva) => {
            const nombreCancha = reserva.cancha?.nombre || 'Cancha eliminada';
            const precioCancha = reserva.precioTotal || reserva.cancha?.precio || 0;
            const nombreDeporte = reserva.cancha?.deporte?.nombre || 'Deporte';
            const estadoReserva = reserva.estado || 'Próxima'; 

            return (
              <div key={reserva.id} className={`tarjeta-reserva ${estadoReserva.toLowerCase()}`}>
                <div className="reserva-header">
                  <span className="reserva-id">Reserva #{reserva.id}</span>
                  <span className={`badge-estado ${estadoReserva.toLowerCase()}`}>
                    {estadoReserva}
                  </span>
                </div>
                
                <div className="reserva-body">
                  <div className="reserva-info">
                    <h4>{nombreCancha}</h4>
                    <p>
                      <strong>Deporte:</strong> {nombreDeporte} {obtenerIcono(nombreDeporte)}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {formatearFecha(reserva.fechaReserva)} a las {reserva.horaInicio}
                    </p>
                  </div>
                  <div className="reserva-precio">
                    <p>Total pagado</p>
                    <h3>${precioCancha.toLocaleString()}</h3>
                    
                    {(estadoReserva.toLowerCase() === 'próxima' || estadoReserva.toLowerCase() === 'confirmada') && (
                      <button 
                        onClick={() => cancelarReserva(reserva.id)} 
                        style={{marginTop: '10px', padding: '8px 12px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                      >
                        Cancelar Reserva
                      </button>
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MisReservas;