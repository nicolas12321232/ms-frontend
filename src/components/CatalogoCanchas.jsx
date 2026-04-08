import { useState, useEffect } from 'react';
import FormularioCancha from './FormularioCancha';

function CatalogoCanchas() {
  const [canchasDB, setCanchasDB] = useState([]);
  const [deportesDB, setDeportesDB] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const cargarDatos = async () => {
    try {
      const [resCanchas, resDeportes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/canchas`),
        fetch(`${import.meta.env.VITE_API_URL}/deportes`)
      ]);

      if (!resCanchas.ok || !resDeportes.ok) throw new Error('Error al cargar datos');

      const datosCanchas = await resCanchas.json();
      const datosDeportes = await resDeportes.json();

      setCanchasDB(datosCanchas);
      setDeportesDB(datosDeportes);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- NUEVA FUNCIÓN MOVIDA DESDE EL FORMULARIO ---
  const manejarNuevoDeporte = async () => {
    const nombreNuevo = prompt('Ingresa el nombre del nuevo deporte (Ej. Baloncesto):');
    if (!nombreNuevo || nombreNuevo.trim() === '') return;

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/deportes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreNuevo })
      });

      if (respuesta.ok) {
        cargarDatos(); // Recarga toda la vista para mostrar el nuevo panel
        alert('Deporte creado exitosamente');
      } else {
        alert('Hubo un error al crear el deporte en la BD.');
      }
    } catch (error) {
      console.error('Error creando deporte:', error);
    }
  };

  const manejarEdicion = async (cancha) => {
    const nuevoPrecio = prompt(`Ingresa el nuevo precio (Actual: $${cancha.precioPorHora}):`, cancha.precioPorHora);
    if (nuevoPrecio !== null && nuevoPrecio.trim() !== '' && !isNaN(nuevoPrecio)) {
      try {
        const canchaActualizada = { ...cancha, precioPorHora: Number(nuevoPrecio) };
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/canchas/${cancha.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(canchaActualizada)
        });
        if (respuesta.ok) cargarDatos();
      } catch (error) {
        console.error("Error actualizando precio:", error);
      }
    }
  };

  const alternarEstadoCancha = async (cancha) => {
    try {
      const nuevoEstado = cancha.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      const canchaActualizada = { ...cancha, estado: nuevoEstado };
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/canchas/${cancha.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(canchaActualizada)
      });
      if (respuesta.ok) cargarDatos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const alternarEstadoDeporte = async (deporte) => {
    try {
      const usaBooleano = typeof deporte.activo === 'boolean';
      const deporteActualizado = usaBooleano 
        ? { ...deporte, activo: !deporte.activo } 
        : { ...deporte, estado: deporte.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };

      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/deportes/${deporte.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deporteActualizado)
      });
      
      if (respuesta.ok) cargarDatos();
    } catch (error) {
      console.error("Error al cambiar estado del deporte:", error);
    }
  };

  if (cargando) return <p style={{ padding: '20px' }}>Cargando catálogo...</p>;

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Catálogo de Canchas y Deportes</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* BOTÓN DE NUEVO DEPORTE AÑADIDO AQUÍ */}
          <button 
            onClick={manejarNuevoDeporte}
            style={{ padding: '10px 20px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
             + Nuevo Deporte
          </button>

          {!mostrarFormulario && (
            <button 
              onClick={() => setMostrarFormulario(true)}
              style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
               Nueva Cancha
            </button>
          )}
        </div>
      </div>

      {mostrarFormulario && (
        <FormularioCancha 
          deportes={deportesDB} // Pasamos la lista de deportes como prop
          alCrearExito={() => {
            cargarDatos();
            setMostrarFormulario(false);
          }} 
          cancelar={() => setMostrarFormulario(false)} 
        />
      )}

      <div style={{ marginTop: '30px' }}>
        {deportesDB.map(deporte => {
          const deporteInactivo = deporte.activo === false || deporte.estado === 'INACTIVO';
          
          const canchasDelDeporte = canchasDB.filter(c => {
            const nombreDepCancha = typeof c.deporte === 'object' ? c.deporte?.nombre : c.deporte;
            return nombreDepCancha === deporte.nombre;
          });

          return (
            <div key={deporte.id} style={{ 
              marginBottom: '40px', 
              padding: '20px', 
              backgroundColor: deporteInactivo ? '#f2f2f2' : '#fdfdfd', 
              border: '1px solid #eee', 
              borderRadius: '8px' 
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: deporteInactivo ? '#7f8c8d' : '#2c3e50' }}>
                  {deporte.nombre} {deporteInactivo && <span style={{ color: '#e74c3c', fontSize: '0.8em' }}>(Servicio Pausado)</span>}
                </h3>
                
                <button 
                  onClick={() => alternarEstadoDeporte(deporte)}
                  style={{ padding: '8px 15px', backgroundColor: deporteInactivo ? '#27ae60' : '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  {deporteInactivo ? '▶️ Activar Deporte' : '⏸️ Pausar Deporte'}
                </button>
              </div>

              {canchasDelDeporte.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No hay canchas creadas para este deporte.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {canchasDelDeporte.map(cancha => {
                    const estaDeshabilitada = cancha.estado === 'INACTIVO' || deporteInactivo;

                    return (
                      <div key={cancha.id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        opacity: estaDeshabilitada ? 0.6 : 1,
                        filter: estaDeshabilitada ? 'grayscale(100%)' : 'none',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'white'
                      }}>
                        
                        <div style={{ position: 'relative' }}>
                          <img src={cancha.imagen || ''} alt={cancha.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                          {estaDeshabilitada && (
                            <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
                              {deporteInactivo ? 'Deporte Inactivo' : 'Cancha Inactiva'}
                            </div>
                          )}
                        </div>

                        <div style={{ padding: '15px' }}>
                          <h4 style={{ margin: '0 0 10px 0' }}>{cancha.nombre}</h4>
                          <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>Precio:</strong> ${cancha.precioPorHora ? cancha.precioPorHora.toLocaleString() : '0'}</p>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              
                              <button 
                                onClick={() => manejarEdicion(cancha)}
                                disabled={deporteInactivo}
                                style={{ flex: 1, padding: '8px', backgroundColor: deporteInactivo ? '#bdc3c7' : '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: deporteInactivo ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
                              >
                                ✏️ Precio
                              </button>

                              <button 
                                onClick={() => alternarEstadoCancha(cancha)}
                                disabled={deporteInactivo}
                                style={{ flex: 1, padding: '8px', backgroundColor: cancha.estado === 'INACTIVO' ? '#27ae60' : (deporteInactivo ? '#bdc3c7' : '#7f8c8d'), color: 'white', border: 'none', borderRadius: '5px', cursor: deporteInactivo ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
                              >
                                {cancha.estado === 'INACTIVO' ? '▶️ Activar' : '⏸️ Pausar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CatalogoCanchas;