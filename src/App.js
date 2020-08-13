import React, {useState} from 'react';
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
    mines: 45,
    blocks: 272
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
  const [timer, setTimer] = useState(0)

  const beginTimer = () => {
    if(!startTimer)
      setStartTimer(true)
  }

  const handleGameEnd = (result) => {
    setStartTimer(false)
    setFlagsLeft(difficulty.mines)
    const win = result === 'win' ? true : false

    Alert.GameEnd(win, timer, () => {})
  }

  const handleDifficultyChanged = (newDifficulty) => {
    setDifficulty(newDifficulty)
    setFlagsLeft(newDifficulty.mines)
  }

  const handleFlagSubstract = () => {
    setFlagsLeft((flagsLeft) => flagsLeft - 1)
  }

  const handleFlagAdd = () => {
    setFlagsLeft((flagsLeft) => flagsLeft + 1)
  }

  const handleTimerUpdate = (timer) => {
    setTimer(timer)
  }

  return (
    <div className="app">
      <div className='game'>
        <TopPanel onTimerUpdate={handleTimerUpdate} flagsLeft={flagsLeft} onDifficultyChanged={handleDifficultyChanged} difficultyOptions={difficultyOptions} startTimer={startTimer}/>
        <Board 
        onFlagSubstract={handleFlagSubstract} 
        onFlagAdd={handleFlagAdd} 
        onGameEnded={handleGameEnd} 
        onGameStarted={beginTimer} 
        difficulty={difficulty} 
        flagEnabled={flagsLeft > 0 ? true : false}
        />
      </div>
    </div>
  );
}

export default App;
