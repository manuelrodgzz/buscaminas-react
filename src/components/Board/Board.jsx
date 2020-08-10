import React, {useState, useEffect, useRef} from 'react'
import ResizeDetector from 'react-resize-detector'
import './Board.css'
import Block from '../Block'

const Board = ({difficulty, onGameStarted, onGameEnded, onFlagSubstract, onFlagAdd}) => {

    const [gameStarted, setGameStarted] = useState(false)
    const [blocks, setBlocks] = useState(null)

    const board = useRef()

    const generateMinesPosition = () => {

        let array = []
        let rndmNumber;

        for(let i = 0; i < difficulty.mines; i++){

            do rndmNumber = Math.floor(Math.random() * (difficulty.blocks + 1))    
            while(array.find(number => number === rndmNumber) === rndmNumber)

            array.push(rndmNumber)
        }


        return array.sort((a, b) => a-b)

    }

    const getNearbyMines = (blockIdx, minesLocation, blocksPerRow, blocksPerColumn) => {

        let minesCounter = 0;

        const left = blockIdx-1;
        const right = blockIdx+1;
        const top_left = blockIdx-blocksPerRow-1;
        const top = blockIdx-blocksPerRow;
        const top_right = blockIdx-blocksPerRow+1;
        const bottom_left = blockIdx+blocksPerRow-1;
        const bottom = blockIdx+blocksPerRow;
        const bottom_right = blockIdx+blocksPerRow+1;

        let possibleMines = [left, right, top_left, top, top_right, bottom_left, bottom, bottom_right]
        let notPossibleMines = []

        //if block is in first column
        if(blockIdx % blocksPerRow === 0)
            notPossibleMines.push(top_left, left, bottom_left)

        //if block is in last column
        if((blockIdx+1) % blocksPerRow === 0)
            notPossibleMines.push(top_right, right, bottom_right)

        //if block is in top row
        if(blockIdx < blocksPerRow)
            notPossibleMines.push(top_left, top, top_right)

        //if block is in bottom row
        //console.log('bottom?', blockIdx >= difficulty.blocks-blocksPerRow-1 && blockIdx <= difficulty.blocks-1);
        if(blockIdx >= difficulty.blocks-blocksPerRow-1 && blockIdx <= difficulty.blocks-1)
            notPossibleMines.push(bottom_left, bottom, bottom_right)

        //delete duplicated posible mines
        //console.log(notPossibleMines);
        notPossibleMines = notPossibleMines.filter((posible, index) => possibleMines.indexOf(posible === index))

        //console.log(blockIdx, notPossibleMines);

        notPossibleMines.map(notPossible => {
            possibleMines = possibleMines.filter(possible => possible !== notPossible)
        })

        possibleMines.map(possible => {

            if(minesLocation.includes(possible))
                minesCounter++

            return possible
        })

        return minesCounter        
    }

    const handleZeroClicked = (index) => {

    }

    const handleFlagAdd = () =>{
        console.log('onFlagAdd BOARD');
        onFlagAdd()
    }

    const handleFlagSubstract = () => {
        console.log('onFlagSubstract BOARD');
        onFlagSubstract()
    }

    const blockGenerator = (boardWidth, boardHeight) => {
        try {
            console.log(boardWidth, boardHeight);
            const boardArea = boardWidth * boardHeight
            let array = []
            const blocksToGenerate = difficulty.blocks
        
            const blockArea = boardArea/blocksToGenerate
            const blockSize = Math.sqrt(blockArea)
            
            const blocksPerRow = Math.floor(boardWidth/blockSize)
            const blocksPerColumn = Math.floor(boardHeight/blockSize)
        
            //console.log('blocksToGenerate', blocksToGenerate);
            //console.log('blockSize', blockSize);
        
            const minesLocation = generateMinesPosition()
            //console.log(minesLocation);

            for(let i = 0; i < blocksToGenerate; i++)
                array.push('')
        
            
            let locationIndx = 0
            setBlocks(
                <React.Fragment>
                {array.map((value, index) => {
                    
                    let isMine = index === minesLocation[locationIndx]

                    const nearbyMines = getNearbyMines(index, minesLocation, blocksPerRow, blocksPerColumn)

                    if(isMine){
                        locationIndx++
                    }

                    return (
                        <Block 
                        index={index}
                        key={index} 
                        size={`${blockSize}px`} 
                        text={index} 
                        mine={isMine} 
                        nearbyMines={nearbyMines}
                        onZeroClicked={handleZeroClicked}
                        onGameLost={() => {onGameEnded('lose')}}
                        onFlagSubstract={handleFlagSubstract}
                        onFlagAdd={handleFlagAdd}/>
                    )
                })}
                </React.Fragment>
            )
        }
        catch(e){console.error(e)}
      }
    

    const handleClick = () => {
        if(!gameStarted){
            onGameStarted()
            setGameStarted(true)
        }

        
    }

    useEffect(() => {
        blockGenerator(board.current.offsetWidth, board.current.offsetHeight)
        console.log(board.current);
    }, [difficulty])

    return(
 
        <div ref={board} className='board' onContextMenu={handleClick} onClick={handleClick}>
            {blocks}
        </div>
        
    )
}

export default Board