import { useState } from "react";
import Navbar from "./components/Navbar";
import SelectorDeporte from "./components/SelectorDeporte";
import SelectorHorario from "./components/SelectorHorario";
import ListaCanchas from "./components/ListaCanchas";
import ConfirmacionReserva from "./components/ConfirmacionReserva";
import MisReservas from "./components/MisReservas";
import CatalogoCanchas from "./components/CatalogoCanchas"; 
import Calendario from "./components/Calendario";
import "./App.css";

function App() {

  const [vistaActual, setVistaActual] = useState("reservar");
  const [deporte, setDeporte] = useState("");
  const [cancha, setCancha] = useState(null);
  const [horarios, setHorarios] = useState([]);

  const manejarCambioDeporte = (nuevoDeporte) => {
    setDeporte(nuevoDeporte);
    setCancha(null);
    setHorarios([]); 
  };

  const manejarCambioCancha = (nuevaCancha) => {
    setCancha(nuevaCancha);
    setHorarios([]); 
  };

  // 3. Lógica de confirmación (Se ejecuta cuando ConfirmacionReserva.jsx termina de guardar en la BD)
  const manejarConfirmacion = () => {
    // CORRECCIÓN 1: Usar horarios.join(", ") para que muestre "19:00, 20:00" en la alerta
    alert(`¡Éxito! Tu reserva para ${cancha.nombre} a las ${horarios.join(", ")} ha sido confirmada.`);
    
    // CORRECCIÓN 2: Limpiar usando setHorarios([]) con arreglo vacío
    setDeporte(""); 
    setHorarios([]); 
    setCancha(null);
    
    // Redirigimos a mis reservas
    setVistaActual("mis-reservas");
  };

  return (
    <div className="app-container">
      <Navbar setVistaActual={setVistaActual} />

      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {vistaActual === "reservar" && (
          <>
            <h1>Reserva tu Cancha</h1>
            
            {/* PASO 1: DEPORTE */}
            <SelectorDeporte deporte={deporte} setDeporte={manejarCambioDeporte} />
            
            {/* PASO 2: CANCHA (Aparece solo si ya hay un deporte) */}
            {deporte && (
              <ListaCanchas
                deporte={deporte}
                canchaSeleccionada={cancha}
                setCancha={manejarCambioCancha}
              />
            )}
            
            {/* PASO 3: HORARIO (Aparece solo si ya hay una cancha elegida) */}
            {cancha && (
              <SelectorHorario 
                cancha={cancha} 
                horarios={horarios} 
                setHorarios={setHorarios} 
              />
            )}
            
            {/* PASO 4: CONFIRMACIÓN (Aparece al tener cancha y al menos un horario seleccionado) */}
            {cancha && horarios.length > 0 && (
              <ConfirmacionReserva 
                deporte={deporte} 
                horarios={horarios} 
                cancha={cancha} 
                alConfirmar={manejarConfirmacion} 
              />
            )}
          </>
        )}

        {vistaActual === "mis-reservas" && <MisReservas />}

        {vistaActual === "catalogo" && (
          <CatalogoCanchas />
        )}

        {vistaActual === "calendario" && (
          <Calendario />
        )}

      </main>
    </div>
  );
}

export default App;