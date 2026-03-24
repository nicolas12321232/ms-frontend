import { useState } from 'react';
import Navbar from './components/Navbar'; 
import SelectorDeporte from './components/SelectorDeporte'; 
import SelectorHorario from './components/SelectorHorario';
import ListaCanchas from './components/ListaCanchas'; 
import './App.css';

function App() {
  const [deporte, setDeporte] = useState('');
  const [horario, setHorario] = useState('');
  const [cancha, setCancha] = useState(null); 

  return (
    <div className="app-container">
      <Navbar /> 
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Reserva tu Cancha</h1>
        
        <SelectorDeporte deporte={deporte} setDeporte={setDeporte} />

        {deporte && (
          <SelectorHorario horario={horario} setHorario={setHorario} />
        )}

        {/* 3. Reemplazamos el mensaje verde por el componente de Canchas */}
        {deporte && horario && (
          <ListaCanchas 
            deporte={deporte} 
            horario={horario} 
            canchaSeleccionada={cancha} 
            setCancha={setCancha} 
          />
        )}
      </main>
    </div>
  )
}

export default App;