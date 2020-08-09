import React, {useState, useEffect, useRef} from 'react';
import TopPanel from './components/TopPanel'
import Board from './components/Board'
import './App.css';

const difficultyOptions = {
  easy: {
    mines: 10,
    blocks: 81
  },
  normal: {
    mines: 35,
    blocks: 132
  },
  hard: {
    mines: 75,
    blocks: 210
  }
}

function App() {

  const [minesLeft, setMinesLeft] = useState(difficultyOptions.easy.mines)
  const [difficulty, setDifficulty] = useState(difficultyOptions.easy)
  const [startTimer, setStartTimer] = useState(false)

  const beginTimer = () => {
    if(!startTimer)
      setStartTimer(true)
  }

  const handleGameEnd = (result) => {

    if(result === 'win'){
      alert('YOU WIN! 🎉🎉🎉')
    }
    else{
      alert('YOU LOSE 😭😭😭')
    }
  }

  const handleDifficultyChanged = (newDifficulty) => {
    setDifficulty(newDifficulty)
  }

  return (
    <div className="app">
      <div className='game'>
        <TopPanel onDifficultyChanged={handleDifficultyChanged} difficultyOptions={difficultyOptions} startTimer={startTimer}/>
        <Board onGameEnded={handleGameEnd} onGameStarted={beginTimer} difficulty={difficulty} />
      </div>
    </div>
  );
}

export default App;
