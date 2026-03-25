import { useState } from 'react';
import FormularioCancha from './FormularioCancha';


function CatalogoCanchas({ listaCanchas, eliminarCancha, agregarCancha, alternarEstado, editarPrecio }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  
  const manejarEdicion = (canchaId, precioActual) => {
    const nuevoPrecio = prompt(`Ingresa el nuevo precio (Actual: $${precioActual}):`, precioActual);
    
    
    if (nuevoPrecio !== null && nuevoPrecio.trim() !== '' && !isNaN(nuevoPrecio)) {
      editarPrecio(canchaId, Number(nuevoPrecio));
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Catálogo de Canchas</h2>
        
        {!mostrarFormulario && (
          <button 
            onClick={() => setMostrarFormulario(true)}
            style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
             Nueva Cancha
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
        {listaCanchas.map(cancha => {
       
          const estaDeshabilitada = cancha.activa === false;

          return (
            <div key={cancha.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              overflow: 'hidden',
              
              opacity: estaDeshabilitada ? 0.6 : 1,
              filter: estaDeshabilitada ? 'grayscale(100%)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              
              <div style={{ position: 'relative' }}>
                <img src={cancha.imagen} alt={cancha.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                {estaDeshabilitada && (
                  <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
                    Inactiva
                  </div>
                )}
              </div>

              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{cancha.nombre}</h4>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Deporte:</strong> {cancha.deporte === 'futbol' ? 'Fútbol ⚽' : 'Vóley 🏐'}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Precio:</strong> ${cancha.precio.toLocaleString()}</p>
                
               
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                   
                    <button 
                      onClick={() => manejarEdicion(cancha.id, cancha.precio)}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      ✏️ Precio
                    </button>

                    
                    <button 
                      onClick={() => alternarEstado(cancha.id)}
                      style={{ flex: 1, padding: '8px', backgroundColor: estaDeshabilitada ? '#27ae60' : '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      {estaDeshabilitada ? '▶️ Activar' : '⏸️ Pausar'}
                    </button>
                  </div>

              
                 
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CatalogoCanchas;