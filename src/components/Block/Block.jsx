import React, {useState} from 'react'
import FlagIcon from '@material-ui/icons/Flag'
import PropTypes from 'prop-types'
import './Block.css'

const Block = ({onFlagSubstract, onFlagAdd, index, size, text, mine, nearbyMines, isHidden, onZeroClicked, onGameLost}) => {


    const [hidden, setHidden] = useState(isHidden)
    const [hasFlag, setHasFlag] = useState(false)

    //Este estilo sirve para que el width tenga x porcentaje y el height tenga el mismo x porcentaje pero basado en el width
    const blockStyle = {
        width: size,
        height: size,
        boxSizing: 'border-box',
        position: 'relative',
        float: 'left',
        color: mine ? 'red' : 'black',
        textAlign: 'center',
        alignItems: 'center'
    }

    const textStyle={
        color: mine ? 'red' : 'green'    
    }

    const handleClick = () => {

        if(hidden)
            setHidden(false)

        if(nearbyMines === 0 && !mine){
            onZeroClicked(index)
        }

        if(mine){
            onGameLost()
            console.log('perdiste 1');
        }
    }

    const handleRightClick = (e) => {

        e.preventDefault()
        setHasFlag(!hasFlag)

        if(hasFlag){
            onFlagAdd()
            console.log('onFlagAdd');
        }
        else{
            onFlagSubstract()
            console.log('onFlagSubstract')
        }


    }

    return(
        <div style={blockStyle} onContextMenu={handleRightClick} onClick={handleClick} className={hidden ? 'block-hidden' : 'block'}>
            {mine.toString()}
            {hidden && hasFlag && <p style={{color: 'red'}}><FlagIcon fontSize='small' /></p>}
            {!hidden && <p style={textStyle}>
                {mine ? <span role='img' aria-label='emoji-bomb'>💣</span> : nearbyMines}
            </p>}
        </div>
    )
}

Block.propTypes = {
    index: PropTypes.number.isRequired,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    mine: PropTypes.bool,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nearbyMines: PropTypes.number.isRequired,
    isHidden: PropTypes.bool
}

Block.defaultProps = {
    isHidden: true,
    mine: false
}


export default Block