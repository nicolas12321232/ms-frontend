import { useState, useEffect } from 'react';
import './ListaCanchas.css';

function ListaCanchas({ deporte, canchaSeleccionada, setCancha }) {
  const [canchasDB, setCanchasDB] = useState([]);
  const [reservasHoy, setReservasHoy] = useState([]);
  const [cargando, setCargando] = useState(true);

  const TOTAL_TURNOS_DIA = 14; 

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [resCanchas, resReservas] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/canchas`),
          fetch(`${import.meta.env.VITE_API_URL}/reservas`)
        ]);

        if (!resCanchas.ok) throw new Error('Error en la carga');

        const canchas = await resCanchas.json();
        const reservas = await resReservas.json();

        setCanchasDB(canchas);

        const hoy = new Date().toISOString().split('T')[0];
        const activasDeHoy = reservas.filter(r => 
          r.fechaReserva === hoy && r.estado !== 'CANCELADA' 
        );
        setReservasHoy(activasDeHoy);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []); 

  const canchasDisponibles = canchasDB.filter((c) => {
    // 1. Validar estado de la CANCHA
    if (c.estado === 'INACTIVO') return false;

    // 2. Validar estado del DEPORTE (Cascada)
    // Verificamos si el objeto deporte existe y si está inactivo (ya sea por boolean 'activo' o string 'estado')
    const deporteObj = c.deporte;
    const deporteInactivo = deporteObj && (deporteObj.activo === false || deporteObj.estado === 'INACTIVO');
    if (deporteInactivo) return false;

    // 3. Validar que coincida con el deporte seleccionado por el usuario
    const nombreDeporteCancha = typeof deporteObj === 'object' ? deporteObj?.nombre : c.deporte;
    if (nombreDeporteCancha !== deporte) return false;

    // 4. Validar disponibilidad de turnos hoy
    const reservasDeEstaCancha = reservasHoy.filter(r => r.cancha.id === c.id);
    if (reservasDeEstaCancha.length >= TOTAL_TURNOS_DIA) return false; 

    return true; 
  });

  if (cargando) return (
    <div className="canchas-container">
      <h3>2. Selecciona tu Cancha</h3>
      <p>Buscando canchas disponibles...</p>
    </div>
  );

  if (!deporte) return null; 

  return (
    <div className="canchas-container">
      <h3>2. Selecciona tu Cancha</h3>
      
      {canchasDisponibles.length === 0 ? (
        <div className="alerta-full">
          <p>😢 ¡Lo sentimos! No hay canchas disponibles para {deporte} en este momento.</p>
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