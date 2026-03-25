import { useState } from 'react';

import imagenLocal from '../assets/cancha-default.jpg'; 

function FormularioCancha({ agregarCancha, cancelar }) {
  const [nombre, setNombre] = useState('');
  const [deporte, setDeporte] = useState('futbol');
  const [tipo, setTipo] = useState('');
  const [precio, setPrecio] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    
    const nuevaCancha = {
      nombre: nombre,
      deporte: deporte,
      tipo: tipo,
      precio: Number(precio),
     
      imagen: imagenLocal 
    };

    agregarCancha(nuevaCancha); 
    cancelar(); 
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
          <select value={deporte} onChange={(e) => setDeporte(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="futbol">Fútbol</option>
            <option value="voley">Vóley</option>
          </select>
        </div>

        <div>
          <label>Tipo de superficie:</label>
          <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label>Precio por hora ($):</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

       

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            💾 Guardar Cancha
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