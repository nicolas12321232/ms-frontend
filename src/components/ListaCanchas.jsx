import './ListaCanchas.css';


function ListaCanchas({ deporte, horario, canchaSeleccionada, setCancha, canchasTotales }) {
  
  
  const canchasFiltradas = canchasTotales.filter(c => c.deporte === deporte);

  return (
    <div className="canchas-container">
      <h3>3. Selecciona tu Cancha (Disponibles a las {horario})</h3>
      <div className="grid-canchas">
        {canchasFiltradas.map((cancha) => (
          <div key={cancha.id} className={`tarjeta-cancha ${canchaSeleccionada?.id === cancha.id ? 'seleccionada' : ''}`}>
            <img src={cancha.imagen} alt={cancha.nombre} className="img-cancha" />
            <div className="info-cancha">
              <h4>{cancha.nombre}</h4>
              <p className="tipo">{cancha.tipo}</p>
              <p className="precio">${cancha.precio.toLocaleString()} / hora</p>
              <button className="btn-reservar" onClick={() => setCancha(cancha)}>
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