import { useState, useEffect } from 'react';
import imagenLocal from '../assets/cancha-default.jpg'; 

// Cambiamos 'agregarCancha' por 'alCrearExito' para que coincida con nuestro Catalogo
function FormularioCancha({ alCrearExito, cancelar }) {
  const [nombre, setNombre] = useState('');
  const [deporteId, setDeporteId] = useState(''); // Ahora guardamos el ID real del deporte
  const [tipo, setTipo] = useState('');
  const [precio, setPrecio] = useState('');
  
  // Nuevos estados para manejar la carga dinámica
  const [deportesDB, setDeportesDB] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // Cargamos los deportes reales de la base de datos para el <select>
  useEffect(() => {
    const cargarDeportes = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/deportes`;
        const respuesta = await fetch(url);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setDeportesDB(datos);
          // Seleccionamos el primer deporte por defecto si existen
          if (datos.length > 0) setDeporteId(datos[0].id);
        }
      } catch (error) {
        console.error("Error cargando deportes:", error);
      }
    };
    cargarDeportes();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault(); 
    setGuardando(true);
    
    // Adaptamos el objeto a lo que Spring Boot suele esperar en relaciones
    const nuevaCancha = {
      nombre: nombre,
      tipo: tipo,
      precio: Number(precio),
      activa: true, // Le damos estado activo por defecto
      imagen: imagenLocal, 
      // Enviamos el deporte como objeto con su ID, que es el formato estándar de JPA/Hibernate
      deporte: { id: Number(deporteId) } 
    };

    try {
      const url = `${import.meta.env.VITE_API_URL}/canchas`;
      const respuesta = await fetch(url, {
        method: 'POST', // Método para CREAR
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCancha)
      });

      if (respuesta.ok) {
        alCrearExito(); // Si todo sale bien, avisamos al catálogo para que recargue y cierre esto
      } else {
        alert("Ocurrió un error al intentar guardar en la base de datos.");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' }}>
      <h3>✨ Agregar Nueva Cancha</h3>
      
      <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Nombre de la cancha:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label>Deporte:</label>
          {/* Menú desplegable dinámico conectado a la Base de Datos */}
          <select value={deporteId} onChange={(e) => setDeporteId(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="" disabled>Selecciona un deporte</option>
            {deportesDB.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Tipo de superficie (ej. Sintética, Madera):</label>
          <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label>Precio por hora ($):</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            type="submit" 
            disabled={guardando}
            style={{ padding: '10px 20px', backgroundColor: guardando ? '#7f8c8d' : '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: guardando ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {guardando ? '⏳ Guardando...' : '💾 Guardar Cancha'}
          </button>
          
          <button type="button" onClick={cancelar} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioCancha;