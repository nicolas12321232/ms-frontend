import { useState, useEffect } from 'react';
import FormularioCancha from './FormularioCancha';

function CatalogoCanchas() {
  // 1. Estados locales (ya no recibimos 'listaCanchas' por props)
  const [canchasDB, setCanchasDB] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // 2. Función para traer las canchas (GET)
  const cargarCanchas = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/canchas`;
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error('Error al cargar');
      const datos = await respuesta.json();
      setCanchasDB(datos);
    } catch (error) {
      console.error("Error obteniendo canchas:", error);
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta al cargar el componente
  useEffect(() => {
    cargarCanchas();
  }, []);

  // 3. Función para editar el precio (PUT)
  const manejarEdicion = async (cancha) => {
    const nuevoPrecio = prompt(`Ingresa el nuevo precio (Actual: $${cancha.precioPorHora}):`, cancha.precioPorHora);
    
    if (nuevoPrecio !== null && nuevoPrecio.trim() !== '' && !isNaN(nuevoPrecio)) {
      try {
        // Preparamos el objeto actualizado
        const canchaActualizada = { ...cancha, precio: Number(nuevoPrecio) };
        
        // Enviamos el PUT a tu backend
        const url = `${import.meta.env.VITE_API_URL}/canchas/${cancha.id}`;
        const respuesta = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(canchaActualizada)
        });

        if (respuesta.ok) {
          cargarCanchas(); // Recargamos la lista si fue exitoso
        } else {
          alert('Error al actualizar el precio en la base de datos');
        }
      } catch (error) {
        console.error("Error actualizando precio:", error);
      }
    }
  };

  // 4. Función para pausar/activar (PUT)
  const alternarEstado = async (cancha) => {
    try {
      // Invertimos el estado actual
      const canchaActualizada = { ...cancha, activa: !cancha.activa };
      
      const url = `${import.meta.env.VITE_API_URL}/canchas/${cancha.id}`;
      const respuesta = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(canchaActualizada)
      });

      if (respuesta.ok) {
        cargarCanchas(); // Recargamos la lista
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  if (cargando) return <p style={{ padding: '20px' }}>Cargando catálogo...</p>;

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

      {/* Al crear una cancha, le decimos que recargue la lista y cierre el form */}
      {mostrarFormulario && (
        <FormularioCancha 
          alCrearExito={() => {
            cargarCanchas();
            setMostrarFormulario(false);
          }} 
          cancelar={() => setMostrarFormulario(false)} 
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {canchasDB.map(cancha => {
          // Asumimos que tu BD tiene un campo booleano 'activa', si no lo tiene, puedes ajustarlo
          const estaDeshabilitada = cancha.activa === false;

          // Extraemos el nombre del deporte (soportando formato objeto de Spring Boot)
          const nombreDeporte = typeof cancha.deporte === 'object' ? cancha.deporte?.nombre : cancha.deporte;

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
                <img src={cancha.imagen || 'https://via.placeholder.com/300x150?text=Sin+Foto'} alt={cancha.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                {estaDeshabilitada && (
                  <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
                    Inactiva
                  </div>
                )}
              </div>

              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{cancha.nombre}</h4>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Deporte:</strong> {nombreDeporte}</p>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Precio:</strong> ${cancha.precioPorHora ? cancha.precioPorHora.toLocaleString() : '0'}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    
                    {/* Le pasamos el objeto 'cancha' completo a la función */}
                    <button 
                      onClick={() => manejarEdicion(cancha)}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      ✏️ Precio
                    </button>

                    <button 
                      onClick={() => alternarEstado(cancha)}
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