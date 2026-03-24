
import './SelectorDeporte.css';


function SelectorDeporte({ deporte, setDeporte }) { 
  
  return (
    <div className="selector-container">
      <h3>1. Selecciona tu Deporte</h3>
      
      <div className="botones-deporte">
        <button 
          className={deporte === 'futbol' ? 'btn-deporte activo' : 'btn-deporte'}
          onClick={() => setDeporte('futbol')}
        >
          ⚽ Fútbol
        </button>

        <button 
          className={deporte === 'voley' ? 'btn-deporte activo' : 'btn-deporte'}
          onClick={() => setDeporte('voley')}
        >
          🏐 Vóley
        </button>
      </div>
    </div>
  );
}

export default SelectorDeporte;