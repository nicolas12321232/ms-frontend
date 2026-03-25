import { useState } from 'react';
import FormularioCancha from './FormularioCancha';


function CatalogoCanchas({ listaCanchas, eliminarCancha, agregarCancha }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2> Catálogo de Canchas</h2>
        
        {!mostrarFormulario && (
          <button 
            onClick={() => setMostrarFormulario(true)}
            style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ➕ Nueva Cancha
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <FormularioCancha 
          agregarCancha={agregarCancha} 
          cancelar={() => setMostrarFormulario(false)} 
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {listaCanchas.map(cancha => (
          <div key={cancha.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={cancha.imagen} alt={cancha.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>{cancha.nombre}</h4>
              <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Deporte:</strong> {cancha.deporte === 'futbol' ? 'Fútbol ⚽' : 'Vóley 🏐'}</p>
              <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Precio:</strong> ${cancha.precio.toLocaleString()}</p>
              
              <button 
                onClick={() => eliminarCancha(cancha.id)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}
              >
                🗑️ Eliminar Cancha
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoCanchas;