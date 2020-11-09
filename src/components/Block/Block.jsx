import React, {useState, useEffect} from 'react'
import FlagIcon from '@material-ui/icons/Flag'
import PropTypes from 'prop-types'
import './Block.css'

const Block = ({lastBlock, onBlockClicked, isMobile, showsOptions, onShowOptions, onHideOptions, flagEnabled, 
    onFlagSubstract, onFlagAdd, index, mine, nearbyMines, isHidden, onGameEnd}) => {


    const [hidden, setHidden] = useState(isHidden)
    const [flag, setFlag] = useState(false)

    //Este estilo sirve para que el width tenga x porcentaje y el height tenga el mismo x porcentaje pero basado en el width
    const blockStyle = {
        boxSizing: 'border-box',
        border: `1px solid ${showsOptions ? 'yellow' : 'black'}`,
        float: 'left',
        color: mine ? 'red' : 'black',
        textAlign: 'center',
        alignItems: 'center'
    }

    const textStyle={
        color: mine ? 'red' : 'green'    
    }

    const handleBlockClicked = (e) => {
        e.stopPropagation()
        console.log('BlockClicked');
        if(hidden){

            setHidden(false)

            if(nearbyMines === 0 && !mine){

            }

            onBlockClicked(index)

            if(lastBlock)
                onGameEnd('win')
        }

        if(mine){
            onGameEnd('lose')
        }
    }

    const handleClick = () => {

        if(!isMobile){
            handleBlockClicked()
        }
        else if(isHidden && !showsOptions){
            onShowOptions(index)
        }
        
    }

    const handleDoubleClick = () => {
        if(isMobile){
            handleBlockClicked()
        }
    }

    const handleRightClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
            
        if(flag){
            onFlagAdd(index)
        }
        else{
            if(!flagEnabled)
                return
                
            onFlagSubstract(index)
        }
        
        setFlag(!flag)
            
    }

    const handleHideOptions = (e) => {
        e.stopPropagation()
        onHideOptions()
    }

    const mobileOptions = (
        <div className='mobile-options'>
            <button onClick={handleBlockClicked}>⛏</button>
            <button onClick={handleRightClick}><FlagIcon fontSize='small' /></button>
            <button onClick={handleHideOptions}>X</button>
        </div>
    )

    useEffect(() => {
        setHidden(isHidden)
    }, [isHidden])

    return(
        <div style={blockStyle} onContextMenu={handleRightClick} onClick={handleClick} 
        className={hidden ? 'block-hidden' : 'block'}>
            {showsOptions ? mobileOptions : ''}
            {hidden && flag && <p style={{color: 'red'}}><FlagIcon fontSize='small' /></p>}
            {!hidden && <p style={textStyle}>
                {mine ? <span role='img' aria-label='emoji-bomb'>💣</span> : nearbyMines > 0 ? nearbyMines : ''}
            </p>}

        </div>
    )
}

Block.propTypes = {
    index: PropTypes.number.isRequired,
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