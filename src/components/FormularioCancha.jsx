import { useState, useEffect } from 'react';

function FormularioCancha({ alCrearExito, cancelar, deportes }) {
  const [nombre, setNombre] = useState('');
  const [deporteId, setDeporteId] = useState('');
  const [precio, setPrecio] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Seleccionamos por defecto el primer deporte de la lista cuando cargue el formulario
  useEffect(() => {
    if (deportes && deportes.length > 0) {
      setDeporteId(deportes[0].id);
    }
  }, [deportes]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);

    const nuevaCancha = {
      nombre: nombre,
      precioPorHora: Number(precio),
      estado: 'DISPONIBLE',
      deporte: { id: Number(deporteId) },
      // Se envían los horarios por defecto para cumplir con la base de datos
      horaApertura: '09:00:00', 
      horaCierre: '23:00:00'    
    };

    try {
      const url = `${import.meta.env.VITE_API_URL}/canchas`;
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCancha)
      });

      if (respuesta.ok) {
        alCrearExito();
      } else {
        const errorText = await respuesta.text();
        console.error("Error exacto del servidor:", errorText);
        alert("Ocurrió un error al intentar guardar en la base de datos. Revisa la consola (F12).");
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
      <br />

      <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <div>
          <label>Nombre de la cancha:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label>Deporte:</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <select value={deporteId} onChange={(e) => setDeporteId(e.target.value)} required style={{ flex: 1, padding: '8px' }}>
              <option value="" disabled>Selecciona un deporte</option>
              {deportes.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
          </div>
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