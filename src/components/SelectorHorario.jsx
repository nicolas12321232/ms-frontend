// src/components/SelectorHorario.jsx
import { useState, useEffect } from "react";
import "./SelectorHorario.css";

function SelectorHorario({ cancha, horarios, setHorarios }) {
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);

  const HORAS_TOTALES = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  useEffect(() => {
    const obtenerHorarios = async () => {
      setCargando(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/reservas`;
        const respuesta = await fetch(url);

        if (!respuesta.ok) throw new Error("Error al consultar reservas");

        const todasLasReservas = await respuesta.json();
        const hoy = new Date().toISOString().split("T")[0];

        const horasOcupadas = todasLasReservas
          .filter(
            (r) =>
              r.cancha.id === cancha.id &&
              r.fechaReserva === hoy &&
              r.estado !== "CANCELADA",
          )
          .map((r) => {
            return r.horaInicio.substring(0, 5);
          });

        const libres = HORAS_TOTALES.filter(
          (hora) => !horasOcupadas.includes(hora),
        );

        setHorasDisponibles(libres);
      } catch (error) {
        console.error("Error cargando horarios:", error);
        setHorasDisponibles(HORAS_TOTALES);
      } finally {
        setCargando(false);
      }
    };

    if (cancha) {
      obtenerHorarios();
    }
  }, [cancha]);

  const manejarClickHora = (horaSeleccionada) => {
    if (horarios.includes(horaSeleccionada)) {
      setHorarios(horarios.filter((h) => h !== horaSeleccionada));
    } else {
      const nuevosHorarios = [...horarios, horaSeleccionada].sort();
      setHorarios(nuevosHorarios);
    }
  };

  if (cargando) {
    return (
      <div className="horario-container">
        <h3>3. Selecciona tu Horario para {cancha?.nombre}</h3>
        <p>Buscando disponibilidad...</p>
      </div>
    );
  }

  return (
    <div className="horario-container">
      <h3>3. Selecciona tu Horario para {cancha?.nombre}</h3>
      <p style={{ marginBottom: "15px", color: "#666" }}>
        Puedes seleccionar más de una hora
      </p>

      {horasDisponibles.length === 0 ? (
        <p className="alerta-full" style={{ color: "red", fontWeight: "bold" }}>
          😢 Esta cancha ya no tiene horarios disponibles para hoy.
        </p>
      ) : (
        <div className="botones-horario">
          {horasDisponibles.map((hora) => (
            <button
              key={hora}
              className={
                horarios.includes(hora) ? "btn-hora activo" : "btn-hora"
              }
              onClick={() => manejarClickHora(hora)}
            >
              🕒 {hora}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectorHorario;
