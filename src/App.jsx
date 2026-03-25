import { useState } from "react";
import Navbar from "./components/Navbar";
import SelectorDeporte from "./components/SelectorDeporte";
import SelectorHorario from "./components/SelectorHorario";
import ListaCanchas from "./components/ListaCanchas";
import ConfirmacionReserva from "./components/ConfirmacionReserva";
import MisReservas from "./components/MisReservas"; 
import "./App.css";

function App() {
  const [vistaActual, setVistaActual] = useState("reservar");
  const [deporte, setDeporte] = useState("");
  const [horario, setHorario] = useState("");
  const [cancha, setCancha] = useState(null);

  const manejarConfirmacion = () => {
    alert(`¡Éxito! Tu reserva para ${cancha.nombre} a las ${horario} ha sido confirmada.`);
    setDeporte("");
    setHorario("");
    setCancha(null);
    setVistaActual("mis-reservas");
  };

  return (
    <div className="app-container">
     
      <Navbar setVistaActual={setVistaActual} />

      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
       
        {vistaActual === "reservar" && (
          <>
            <h1>Reserva tu Cancha</h1>

            <SelectorDeporte deporte={deporte} setDeporte={setDeporte} />

            {deporte && (
              <SelectorHorario horario={horario} setHorario={setHorario} />
            )}

            {deporte && horario && (
              <ListaCanchas
                deporte={deporte}
                horario={horario}
                canchaSeleccionada={cancha}
                setCancha={setCancha}
              />
            )}

            {cancha && (
              <ConfirmacionReserva
                deporte={deporte}
                horario={horario}
                cancha={cancha}
                alConfirmar={manejarConfirmacion}
              />
            )}
          </>
        )}

      
        {vistaActual === "mis-reservas" && (
          <MisReservas />
        )}

      </main>
    </div>
  );
}

export default App;