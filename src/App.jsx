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
  const [horario, setHorario] = useState("");
  const [cancha, setCancha] = useState(null);

 
  const [listaCanchas, setListaCanchas] = useState([
    { id: 1, nombre: 'Cancha Los Pinos', deporte: 'futbol', tipo: 'Sintética 5v5', precio: 50000, imagen: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=400' },
    { id: 2, nombre: 'El Campín Pequeño', deporte: 'futbol', tipo: 'Grama natural 11v11', precio: 120000, imagen: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=400' },
    { id: 3, nombre: 'Arena Vóley Sur', deporte: 'voley', tipo: 'Arena', precio: 40000, imagen: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=400' },
    { id: 4, nombre: 'Coliseo Techado', deporte: 'voley', tipo: 'Maderamen', precio: 60000, imagen: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=400' },
  ]);


  const eliminarCancha = (idABorrar) => {
   
    const nuevaLista = listaCanchas.filter(cancha => cancha.id !== idABorrar);
    setListaCanchas(nuevaLista);
  };

  const agregarCancha = (nuevaCancha) => {
    
    const nuevoId = listaCanchas.length > 0 ? Math.max(...listaCanchas.map(c => c.id)) + 1 : 1;
    const canchaConId = { ...nuevaCancha, id: nuevoId };
    
    
    setListaCanchas([...listaCanchas, canchaConId]);
  };

  const manejarConfirmacion = () => {
    alert(`¡Éxito! Tu reserva para ${cancha.nombre} a las ${horario} ha sido confirmada.`);
    setDeporte(""); setHorario(""); setCancha(null);
    setVistaActual("mis-reservas");
  };

  const editarPrecioCancha = (id, nuevoPrecio) => {
    const canchasActualizadas = listaCanchas.map(cancha => {
      if (cancha.id === id) {
        return { ...cancha, precio: nuevoPrecio }; 
      }
      return cancha;
    });
    setListaCanchas(canchasActualizadas);
  };

 
  const alternarEstadoCancha = (id) => {
    const canchasActualizadas = listaCanchas.map(cancha => {
      if (cancha.id === id) {
        
        const estadoActual = cancha.activa !== undefined ? cancha.activa : true;
        return { ...cancha, activa: !estadoActual }; 
      }
      return cancha;
    });
    setListaCanchas(canchasActualizadas);
  };

  const canchasActivas = listaCanchas.filter(cancha => cancha.activa !== false);
  return (
    <div className="app-container">
      <Navbar setVistaActual={setVistaActual} />

      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {vistaActual === "reservar" && (
          <>
            <h1>Reserva tu Cancha</h1>
            <SelectorDeporte deporte={deporte} setDeporte={setDeporte} />
            {deporte && <SelectorHorario horario={horario} setHorario={setHorario} />}
            {deporte && horario && (
              <ListaCanchas
                deporte={deporte}
                horario={horario}
                canchaSeleccionada={cancha}
                setCancha={setCancha}
                canchasTotales={listaCanchas} 
              />
            )}
            {cancha && (
              <ConfirmacionReserva deporte={deporte} horario={horario} cancha={cancha} alConfirmar={manejarConfirmacion} />
            )}
          </>
        )}

        {vistaActual === "mis-reservas" && <MisReservas />}

       
        {vistaActual === "catalogo" && (
          <CatalogoCanchas 
          listaCanchas={listaCanchas} 
            eliminarCancha={eliminarCancha} 
            agregarCancha={agregarCancha}
            alternarEstado={alternarEstadoCancha}
            editarPrecio={editarPrecioCancha}
            
          />
        )}

        {vistaActual === "calendario" && (
         <Calendario listaCanchas={canchasActivas} />
        )}

      </main>
    </div>
  );
}

export default App;