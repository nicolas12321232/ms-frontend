import { useState, useEffect } from 'react';
import './ListaCanchas.css';

// Ya no recibimos 'horario' por props, porque este es el paso 2
function ListaCanchas({ deporte, canchaSeleccionada, setCancha }) {
  const [canchasDB, setCanchasDB] = useState([]);
  const [reservasHoy, setReservasHoy] = useState([]);
  const [cargando, setCargando] = useState(true);

  // De 9:00 AM a 11:00 PM (23:00) hay 14 turnos posibles de 1 hora.
  const TOTAL_TURNOS_DIA = 14; 

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // 1. Traemos las canchas
        const resCanchas = await fetch(`${import.meta.env.VITE_API_URL}/canchas`);
        if (!resCanchas.ok) throw new Error('Error al cargar las canchas');
        const canchas = await resCanchas.json();
        
        // 2. Traemos TODAS las reservas
        const resReservas = await fetch(`${import.meta.env.VITE_API_URL}/reservas`);
        const reservas = await resReservas.json();

        setCanchasDB(canchas);

        // 3. Filtramos para saber qué está ocupado HOY
        const hoy = new Date().toISOString().split('T')[0];
        const activasDeHoy = reservas.filter(r => 
          r.fechaReserva === hoy && 
          r.estado !== 'CANCELADA' // Ignoramos las canceladas porque liberan cupo
        );
        setReservasHoy(activasDeHoy);

      } catch (error) {
        console.error("Hubo un error:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []); 

  // Lógica de filtrado combinada (Deporte + Disponibilidad)
  const canchasDisponibles = canchasDB.filter((c) => {
    // A. Validar que sea del deporte seleccionado
    const nombreDeporteCancha = typeof c.deporte === 'object' ? c.deporte?.nombre : c.deporte;
    if (nombreDeporteCancha !== deporte) return false;

    // B. Validar que la cancha NO esté 100% llena hoy
    const reservasDeEstaCancha = reservasHoy.filter(r => r.cancha.id === c.id);
    if (reservasDeEstaCancha.length >= TOTAL_TURNOS_DIA) return false; // La ocultamos

    return true; // Si pasa ambas pruebas, se muestra
  });

  if (cargando) {
    return (
      <div className="canchas-container">
        <h3>2. Selecciona tu Cancha</h3>
        <p>Buscando canchas disponibles...</p>
      </div>
    );
  }

  if (!deporte) return null; // Por seguridad, si no hay deporte, no mostramos nada

  return (
    <div className="canchas-container">
      <h3>2. Selecciona tu Cancha</h3>
      
      {/* Mensaje inteligente si todo está ocupado o no hay canchas */}
      {canchasDisponibles.length === 0 ? (
        <div className="alerta-full">
          <p>😢 ¡Lo sentimos! Para el día de hoy no hay canchas disponibles para {deporte}.</p>
        </div>
      ) : (
        <div className="grid-canchas">
          {canchasDisponibles.map((cancha) => (
            <div key={cancha.id} className={`tarjeta-cancha ${canchaSeleccionada?.id === cancha.id ? 'seleccionada' : ''}`}>
              
              <img 
                src={cancha.imagen || 'https://via.placeholder.com/300x150?text=Cancha+Sin+Foto'} 
                alt={cancha.nombre} 
                className="img-cancha" 
              />
              
              <div className="info-cancha">
                <h4>{cancha.nombre}</h4>
                <p className="tipo">{cancha.tipo || 'Estándar'}</p>
                <p className="precio">${cancha.precioPorHora ? cancha.precioPorHora.toLocaleString() : '0'} / hora</p>
                
                <button className="btn-reservar" onClick={() => setCancha(cancha)}>
                  {canchaSeleccionada?.id === cancha.id ? '✅ Seleccionada' : 'Elegir esta cancha'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaCanchas;