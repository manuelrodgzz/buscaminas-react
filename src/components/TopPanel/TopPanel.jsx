import React, {useState, useRef, useEffect} from 'react'
import FlagIcon from '@material-ui/icons/Flag';
import TimerIcon from '@material-ui/icons/Timer';
import './TopPanel.css'

const TopPanel = ({onTimerUpdate, flagsLeft, difficultyOptions, onDifficultyChanged, startTimer}) => {

    const [timer, setTimer] = useState(0)
    const difficultySelector = useRef()

    useEffect(() => {

        let interval;

        difficultySelector.current.addEventListener('change', () => {
            onDifficultyChanged(difficultyOptions[difficultySelector.current.value])
        })

        //Si startTimer es true se inicia el cronómetro
        if(startTimer)
            interval = setInterval(() => {
                setTimer(timer + 1);
                onTimerUpdate(timer+1)
            }, 1000)
        else //Si es falso, el cronometro se setea en 0
            setTimer(0)
    
        return  () => {
            difficultySelector.current.removeEventListener('change', () => {
                onDifficultyChanged(difficultyOptions[difficultySelector.current.value])
                })

            clearInterval(interval)
        }

      }, [startTimer, timer])

    return(
        <div className='top-panel'>
            <div className='difficulty-settings'>
            Dificultad:
            <select ref={difficultySelector}>
                <option value='easy'>Fácil</option>
                <option value='normal'>Medio</option>
                <option value='hard'>Difícil</option>
            </select>
            </div>

            <div className='mines-left'>
            <FlagIcon fontSize='small' style={{color: 'red', marginRight: 5}}/>
            {flagsLeft}
            </div>

            <div className='timer'>
            <TimerIcon fontSize='small' style={{color: '#ebb11e'}}/>
            {timer}
            </div>
        </div>
    )
}

export default TopPanel