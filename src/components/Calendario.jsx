import { useState, useEffect } from 'react';

// Ya no recibimos listaCanchas por props
function Calendario() {
  const [fechaActual, setFechaActual] = useState(new Date());
  const obtenerFechaStr = (fecha) => fecha.toISOString().split('T')[0];
  const fechaActualStr = obtenerFechaStr(fechaActual);

  // 1. Nuevos estados para manejar datos del Backend
  const [listaCanchas, setListaCanchas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [slotSeleccionado, setSlotSeleccionado] = useState(null); 
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null); 

  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  // 2. useEffect para traer las Canchas Activas
  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/canchas`);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          // Filtramos solo las activas
          setListaCanchas(datos.filter(c => c.activa !== false));
        }
      } catch (error) {
        console.error("Error cargando canchas en calendario:", error);
      }
    };
    cargarCanchas();
  }, []);

  // 3. useEffect para traer las Reservas del día seleccionado
  useEffect(() => {
    const cargarReservas = async () => {
      setCargando(true);
      try {
        // En el futuro, Spring Boot debería tener este endpoint:
        const url = `${import.meta.env.VITE_API_URL}/reservas/fecha/${fechaActualStr}`;
        const respuesta = await fetch(url);
        
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setEventos(datos);
        } else {
          throw new Error("El endpoint de reservas aún no está listo");
        }
      } catch (error) {
        // PLAN B: Si falla el backend, vaciamos los eventos o dejamos los de prueba
        setEventos([]);
      } finally {
        setCargando(false);
      }
    };
    cargarReservas();
  }, [fechaActualStr]); // Se vuelve a ejecutar si cambias de día

  const cambiarDia = (diasAvanzar) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + diasAvanzar);
    setFechaActual(nuevaFecha);
    setSlotSeleccionado(null);
    setEventoSeleccionado(null);
  };

  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaTexto = fechaActual.toLocaleDateString('es-ES', opcionesFecha);

  const obtenerEvento = (canchaId, hora) => {
    // Adaptado para leer cancha.id si viene anidado de Spring Boot o localmente
    return eventos.find(e => 
      (e.canchaId === canchaId || (e.cancha && e.cancha.id === canchaId)) && 
      e.hora === hora && 
      e.fecha === fechaActualStr
    );
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

  // 4. Conectado para hacer un POST a la BD
  const agregarEvento = async (tipoEvento) => {
    let titulo = prompt(tipoEvento === 'reserva' ? 'Ingresa el nombre de quien reserva:' : 'Motivo del mantenimiento:');
    if (!titulo) return; 

    const nuevoEvento = {
      fecha: fechaActualStr,
      hora: slotSeleccionado.hora,
      tipo: tipoEvento, 
      titulo: titulo,
      cancha: { id: slotSeleccionado.cancha.id } // Formato Spring Boot
    };
    
    try {
      const url = `${import.meta.env.VITE_API_URL}/reservas`;
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEvento)
      });

      if (respuesta.ok) {
        const eventoGuardado = await respuesta.json();
        setEventos([...eventos, eventoGuardado]); // Actualiza UI con el ID real de la BD
      } else {
        throw new Error("Fallo en backend");
      }
    } catch (error) {
      console.log("Guardado local (Backend no disponible):", error);
      // Fallback local
      setEventos([...eventos, { ...nuevoEvento, id: Date.now(), canchaId: slotSeleccionado.cancha.id }]);
    }
    setSlotSeleccionado(null); 
  };

  // 5. Conectado para hacer un DELETE a la BD
  const eliminarEvento = async (idEvento) => {
    if(window.confirm("¿Estás seguro de cancelar este turno/mantenimiento?")) {
      try {
        const url = `${import.meta.env.VITE_API_URL}/reservas/${idEvento}`;
        const respuesta = await fetch(url, { method: 'DELETE' });

        if (respuesta.ok) {
          setEventos(eventos.filter(e => e.id !== idEvento));
        } else {
          throw new Error("Fallo al eliminar en backend");
        }
      } catch (error) {
        console.log("Eliminación local (Backend no disponible):", error);
        // Fallback local
        setEventos(eventos.filter(e => e.id !== idEvento));
      }
      setEventoSeleccionado(null);
    }
  };

  if (cargando && listaCanchas.length === 0) {
    return <div style={{ padding: '30px', textAlign: 'center' }}><h3>Cargando agenda...</h3></div>;
  }

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
                     {/* Mostramos el nombre del deporte que viene de la BD */}
                     {cancha.deporte ? cancha.deporte.nombre : 'Deporte'}
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
                              {evento.tipo === 'reserva' ? '👤 Reserva' : '🔧 Mant.'}
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
        
        {listaCanchas.length === 0 && !cargando && (
            <p style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>No hay canchas activas registradas.</p>
        )}
      </div>

      {slotSeleccionado && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', border: '2px dashed #bdc3c7', borderRadius: '10px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>➕ Agregar evento a las {slotSeleccionado.hora}</h4>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Cancha: {slotSeleccionado.cancha.nombre}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
               <button style={{...estilos.btn, backgroundColor: '#3498db'}} onClick={() => agregarEvento('reserva')}>👤 Nueva Reserva</button>
               <button style={{...estilos.btn, backgroundColor: '#f39c12'}} onClick={() => agregarEvento('mantenimiento')}>🔧 Bloquear (Mantenimiento)</button>
               <button style={{...estilos.btn, backgroundColor: '#95a5a6'}} onClick={() => setSlotSeleccionado(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {eventoSeleccionado && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fdf2e9', border: '2px solid #e67e22', borderRadius: '10px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#d35400' }}>ℹ️ Detalles del Turno ({eventoSeleccionado.hora})</h4>
              <p style={{ margin: 0, color: '#2c3e50', fontSize: '1.1rem' }}>
                <strong>{eventoSeleccionado.tipo === 'reserva' ? 'Reserva a nombre de: ' : 'Motivo: '}</strong> 
                {eventoSeleccionado.titulo}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
               <button style={{...estilos.btn, backgroundColor: '#e74c3c'}} onClick={() => eliminarEvento(eventoSeleccionado.id)}>🗑️ Cancelar / Liberar Horario</button>
               <button style={{...estilos.btn, backgroundColor: '#95a5a6'}} onClick={() => setEventoSeleccionado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const estilos = {
  btnFlecha: { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', padding: '5px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  thHora: { backgroundColor: '#2f3542', color: 'white', padding: '15px', width: '80px', borderTopLeftRadius: '12px' },
  thCancha: { backgroundColor: '#2f3542', color: 'white', padding: '15px', borderLeft: '1px solid #57606f' },
  tdHora: { fontWeight: 'bold', padding: '15px', color: '#7f8c8d', borderRight: '1px solid #eaeced', borderBottom: '1px solid #eaeced' },
  tdSlot: { padding: '8px', borderRight: '1px solid #eaeced', borderBottom: '1px solid #eaeced', minWidth: '150px' },
  slotBasico: { padding: '15px 10px', borderRadius: '8px', fontSize: '0.9rem', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', boxSizing: 'border-box' },
  slotLibreColor: { backgroundColor: '#e8f8f5', color: '#1abc9c', border: '1px solid transparent', cursor: 'pointer' },
  slotReservaColor: { backgroundColor: '#e8f4f8', color: '#2980b9', border: '1px solid #3498db', cursor: 'pointer' },
  slotMantenimientoColor: { backgroundColor: '#fcf3cf', color: '#d35400', border: '1px solid #f1c40f', cursor: 'pointer' },
  btn: { padding: '10px 15px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Calendario;