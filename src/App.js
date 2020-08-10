import React, {useState, useEffect, useRef} from 'react';
import TopPanel from './components/TopPanel'
import Board from './components/Board'
import Alert from './utils/Alert'
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

  const [flagsLeft, setFlagsLeft] = useState(difficultyOptions.easy.mines)
  const [difficulty, setDifficulty] = useState(difficultyOptions.easy)
  const [startTimer, setStartTimer] = useState(false)

  const beginTimer = () => {
    if(!startTimer)
      setStartTimer(true)
  }

  const handleGameEnd = (result) => {
    setStartTimer(false)

    const win = result === 'win' ? true : false

    Alert.GameEnd(win, 50, () => {})
  }

  const handleDifficultyChanged = (newDifficulty) => {
    setDifficulty(newDifficulty)
    setFlagsLeft(newDifficulty.mines)
  }

  const handleFlagSubstract = () => {
    console.log('onFlagSubstract APP');
    setFlagsLeft(flagsLeft - 1)
  }

  const handleFlagAdd = () => {
    console.log('onFlagAdd APP')
    setFlagsLeft(flagsLeft + 1)
  }

  return (
    <div className="app">
      <div className='game'>
        <TopPanel flagsLeft={flagsLeft} onDifficultyChanged={handleDifficultyChanged} difficultyOptions={difficultyOptions} startTimer={startTimer}/>
        <Board 
        onFlagSubstract={handleFlagSubstract} 
        onFlagAdd={handleFlagAdd} 
        onGameEnded={handleGameEnd} 
        onGameStarted={beginTimer} 
        difficulty={difficulty} />
      </div>
    </div>
  );
}

export default App;
