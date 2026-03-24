// src/components/SelectorHorario.jsx
import './SelectorHorario.css';

function SelectorHorario({ horario, setHorario }) {

  const horasDisponibles = ['18:00', '19:00', '20:00', '21:00'];

  return (
    <div className="horario-container">
      <h3>2. Selecciona tu Horario</h3>
      <div className="botones-horario">
       
        {horasDisponibles.map((hora) => (
          <button
            key={hora}
            className={horario === hora ? 'btn-hora activo' : 'btn-hora'}
            onClick={() => setHorario(hora)}
          >
            🕒 {hora}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectorHorario;