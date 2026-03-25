import { useState } from 'react';

function Calendario({ listaCanchas }) {
  const [fechaActual, setFechaActual] = useState(new Date());
  

  const obtenerFechaStr = (fecha) => fecha.toISOString().split('T')[0];

  
  const [eventos, setEventos] = useState([
    
    { id: 1, canchaId: 1, fecha: obtenerFechaStr(new Date()), hora: '18:00', tipo: 'reserva', titulo: 'Partido de Carlos' },
    { id: 2, canchaId: 2, fecha: obtenerFechaStr(new Date()), hora: '10:00', tipo: 'mantenimiento', titulo: 'Cambio de red' }
  ]);

  const [slotSeleccionado, setSlotSeleccionado] = useState(null); 
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null); 

  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const cambiarDia = (diasAvanzar) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + diasAvanzar);
    setFechaActual(nuevaFecha);
    setSlotSeleccionado(null);
    setEventoSeleccionado(null);
  };

  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaTexto = fechaActual.toLocaleDateString('es-ES', opcionesFecha);
  const fechaActualStr = obtenerFechaStr(fechaActual);

  
  const obtenerEvento = (canchaId, hora) => {
    return eventos.find(e => e.canchaId === canchaId && e.hora === hora && e.fecha === fechaActualStr);
  };

  const manejarClicCelda = (cancha, hora, evento) => {
    if (evento) {
      setEventoSeleccionado(evento); 
      setSlotSeleccionado(null);
    } else {
      setSlotSeleccionado({ cancha, hora }); 
      setEventoSeleccionado(null);
    }
  };

  const agregarEvento = (tipoEvento) => {
    let titulo = prompt(tipoEvento === 'reserva' ? 'Ingresa el nombre de quien reserva:' : 'Motivo del mantenimiento:');
    if (!titulo) return; 

    const nuevoEvento = {
      id: Date.now(), 
      canchaId: slotSeleccionado.cancha.id,
      fecha: fechaActualStr,
      hora: slotSeleccionado.hora,
      tipo: tipoEvento, 
      titulo: titulo
    };
    
    setEventos([...eventos, nuevoEvento]);
    setSlotSeleccionado(null); 
  };

  const eliminarEvento = (idEvento) => {
    if(window.confirm("¿Estás seguro de cancelar este turno/mantenimiento?")) {
      setEventos(eventos.filter(e => e.id !== idEvento));
      setEventoSeleccionado(null);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      
  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.8rem' }}>📅 Agenda de Canchas</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f1f2f6', padding: '5px 15px', borderRadius: '30px' }}>
           <button onClick={() => cambiarDia(-1)} style={estilos.btnFlecha}>⬅️</button>
           <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#2f3542', minWidth: '220px', textAlign: 'center' }}>
             {fechaTexto}
           </span>
           <button onClick={() => cambiarDia(1)} style={estilos.btnFlecha}>➡️</button>
        </div>
      </div>

    
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '0.9rem', color: '#7f8c8d' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{width:'15px', height:'15px', backgroundColor:'#e8f8f5', border:'1px solid #1abc9c', borderRadius:'4px'}}></div> Libre
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{width:'15px', height:'15px', backgroundColor:'#e8f4f8', border:'1px solid #3498db', borderRadius:'4px'}}></div> Reserva
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{width:'15px', height:'15px', backgroundColor:'#fcf3cf', border:'1px solid #f1c40f', borderRadius:'4px'}}></div> Mantenimiento
        </span>
      </div>

     
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #eaeced' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '700px' }}>
          <thead>
            <tr>
              <th style={estilos.thHora}>⏰</th>
              {listaCanchas.map(cancha => (
                <th key={cancha.id} style={estilos.thCancha}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{cancha.nombre}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.8 }}>
                    {cancha.deporte === 'futbol' ? '⚽ Fútbol' : '🏐 Vóley'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora, index) => (
              <tr key={hora} style={{ backgroundColor: index % 2 === 0 ? '#fdfefe' : 'white' }}>
                <td style={estilos.tdHora}>{hora}</td>
                {listaCanchas.map(cancha => {
                  const evento = obtenerEvento(cancha.id, hora);
                  
                  return (
                    <td key={`${cancha.id}-${hora}`} style={estilos.tdSlot}>
                      <div 
                        onClick={() => manejarClicCelda(cancha, hora, evento)}
                        className={!evento ? "slot-libre" : "slot-evento"} 
                        style={{
                          ...estilos.slotBasico,
                          ...(!evento ? estilos.slotLibreColor : 
                              evento.tipo === 'reserva' ? estilos.slotReservaColor : 
                              estilos.slotMantenimientoColor)
                        }}
                      >
                        {!evento ? '➕' : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                              {evento.tipo === 'reserva' ? '👤 Reserva' : '🔧 Mantenimiento'}
                            </span>
                            <span style={{ fontSize: '0.9rem', marginTop: '2px' }}>{evento.titulo}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {slotSeleccionado && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', border: '2px dashed #bdc3c7', borderRadius: '10px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>➕ Agregar evento a las {slotSeleccionado.hora}</h4>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Cancha: {slotSeleccionado.cancha.nombre}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
               <button style={{...estilos.btn, backgroundColor: '#3498db'}} onClick={() => agregarEvento('reserva')}>👤 Nueva Reserva</button>
               <button style={{...estilos.btn, backgroundColor: '#f39c12'}} onClick={() => agregarEvento('mantenimiento')}>🔧 Bloquear (Mantenimiento)</button>
               <button style={{...estilos.btn, backgroundColor: '#95a5a6'}} onClick={() => setSlotSeleccionado(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

     
      {eventoSeleccionado && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fdf2e9', border: '2px solid #e67e22', borderRadius: '10px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#d35400' }}>ℹ️ Detalles del Turno ({eventoSeleccionado.hora})</h4>
              <p style={{ margin: 0, color: '#2c3e50', fontSize: '1.1rem' }}>
                <strong>{eventoSeleccionado.tipo === 'reserva' ? 'Reserva a nombre de: ' : 'Motivo: '}</strong> 
                {eventoSeleccionado.titulo}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
               <button style={{...estilos.btn, backgroundColor: '#e74c3c'}} onClick={() => eliminarEvento(eventoSeleccionado.id)}>🗑️ Cancelar / Liberar Horario</button>
               <button style={{...estilos.btn, backgroundColor: '#95a5a6'}} onClick={() => setEventoSeleccionado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos
const estilos = {
  btnFlecha: { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', padding: '5px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  thHora: { backgroundColor: '#2f3542', color: 'white', padding: '15px', width: '80px', borderTopLeftRadius: '12px' },
  thCancha: { backgroundColor: '#2f3542', color: 'white', padding: '15px', borderLeft: '1px solid #57606f' },
  tdHora: { fontWeight: 'bold', padding: '15px', color: '#7f8c8d', borderRight: '1px solid #eaeced', borderBottom: '1px solid #eaeced' },
  tdSlot: { padding: '8px', borderRight: '1px solid #eaeced', borderBottom: '1px solid #eaeced', minWidth: '150px' },
  slotBasico: { padding: '15px 10px', borderRadius: '8px', fontSize: '0.9rem', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', boxSizing: 'border-box' },
  
  // Colores según el tipo
  slotLibreColor: { backgroundColor: '#e8f8f5', color: '#1abc9c', border: '1px solid transparent', cursor: 'pointer' },
  slotReservaColor: { backgroundColor: '#e8f4f8', color: '#2980b9', border: '1px solid #3498db', cursor: 'pointer' },
  slotMantenimientoColor: { backgroundColor: '#fcf3cf', color: '#d35400', border: '1px solid #f1c40f', cursor: 'pointer' },
  
  btn: { padding: '10px 15px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Calendario;