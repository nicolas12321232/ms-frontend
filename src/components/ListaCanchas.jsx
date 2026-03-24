import './ListaCanchas.css';

function ListaCanchas({ deporte, horario, canchaSeleccionada, setCancha }) {
  
 
  const canchasMock = [
    { id: 1, nombre: 'Cancha Los Pinos', deporte: 'futbol', tipo: 'Sintética 5v5', precio: 50000, imagen: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=400' },
    { id: 2, nombre: 'El Campín Pequeño', deporte: 'futbol', tipo: 'Grama natural 11v11', precio: 120000, imagen: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=400' },
    { id: 3, nombre: 'Arena Vóley Sur', deporte: 'voley', tipo: 'Arena', precio: 40000, imagen: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=400' },
    { id: 4, nombre: 'Coliseo Techado', deporte: 'voley', tipo: 'Maderamen', precio: 60000, imagen: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=400' },
  ];

  // 2. Filtramos para mostrar SOLO las canchas del deporte seleccionado
  const canchasFiltradas = canchasMock.filter(c => c.deporte === deporte);

  return (
    <div className="canchas-container">
      <h3>3. Selecciona tu Cancha (Disponibles a las {horario})</h3>
      
      <div className="grid-canchas">
        
        {canchasFiltradas.map((cancha) => (
          <div 
            key={cancha.id} 
            className={`tarjeta-cancha ${canchaSeleccionada?.id === cancha.id ? 'seleccionada' : ''}`}
          >
            <img src={cancha.imagen} alt={cancha.nombre} className="img-cancha" />
            <div className="info-cancha">
              <h4>{cancha.nombre}</h4>
              <p className="tipo">{cancha.tipo}</p>
              <p className="precio">${cancha.precio.toLocaleString()} / hora</p>
              
              <button 
                className="btn-reservar"
                onClick={() => setCancha(cancha)}
              >
                {canchaSeleccionada?.id === cancha.id ? '✅ Seleccionada' : 'Elegir esta cancha'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaCanchas;