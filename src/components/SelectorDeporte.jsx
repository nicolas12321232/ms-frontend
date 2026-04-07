import { useState, useEffect } from 'react';
import './SelectorDeporte.css';

function SelectorDeporte({ deporte, setDeporte }) { 
  const [deportesDB, setDeportesDB] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDeportes = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/deportes`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        setDeportesDB(datos); 
      } catch (error) {
        console.error("Error al traer los deportes:", error);
      } finally {
        setCargando(false); 
      }
    };

    obtenerDeportes();
  }, []);

  // Función auxiliar para poner un emoji dinámico según el nombre del deporte
  const obtenerIcono = (nombreDeporte) => {
    const nombre = nombreDeporte.toLowerCase();
    if (nombre.includes('futbol') || nombre.includes('fútbol')) return '⚽';
    if (nombre.includes('voley') || nombre.includes('voleibol')) return '🏐';
    if (nombre.includes('basquet') || nombre.includes('básquet')) return '🏀';
    if (nombre.includes('tenis')) return '🎾';
    return '🏅'; // Emoji por defecto si agregas otro deporte distinto
  };

  if (cargando) {
    return (
      <div className="selector-container">
        <h3>1. Selecciona tu Deporte</h3>
        <p>Cargando deportes desde la base de datos...</p>
      </div>
    );
  }

  return (
    <div className="selector-container">
      <h3>1. Selecciona tu Deporte</h3>
      
      <div className="botones-deporte">
        {deportesDB.map((dep) => (
          <button 
            key={dep.id}
            className={deporte === dep.nombre ? 'btn-deporte activo' : 'btn-deporte'}
            onClick={() => setDeporte(dep.nombre)}
          >
            {/* Llamamos a la función para pintar el emoji correcto */}
            {obtenerIcono(dep.nombre)} {dep.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectorDeporte;