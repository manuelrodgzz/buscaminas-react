import React, {useState, useEffect, useRef} from 'react'
import ResizeDetector from 'react-resize-detector'
import './Board.css'
import Block from '../Block'

const Board = ({flagEnabled, difficulty, onGameStarted, onGameEnded, onFlagSubstract, onFlagAdd}) => {

    const [gameStarted, setGameStarted] = useState(false)
    const [blocks, setBlocks] = useState(null)
    const [minesPosition, setMinesPosition] = useState([])

    const board = useRef()

    const generateMinesPosition = () => {

        let array = []
        let rndmNumber;

        for(let i = 0; i < difficulty.mines; i++){

            do rndmNumber = Math.floor(Math.random() * (difficulty.blocks))    
            while(array.find(number => number === rndmNumber) === rndmNumber)

            array.push(rndmNumber)
        }


        return array.sort((a, b) => a-b)

    }

    const getBlocksAround = (blockIdx, blocksPerRow) => {
        const left = blockIdx-1;
        const right = blockIdx+1;
        const top_left = blockIdx-blocksPerRow-1;
        const top = blockIdx-blocksPerRow;
        const top_right = blockIdx-blocksPerRow+1;
        const bottom_left = blockIdx+blocksPerRow-1;
        const bottom = blockIdx+blocksPerRow;
        const bottom_right = blockIdx+blocksPerRow+1;

        let blocksAround = [left, right, top_left, top, top_right, bottom_left, bottom, bottom_right]
        let notBlocksAround = []

        //if block is in first column
        if(blockIdx % blocksPerRow === 0)
            notBlocksAround.push(top_left, left, bottom_left)

        //if block is in last column
        if((blockIdx+1) % blocksPerRow === 0)
            notBlocksAround.push(top_right, right, bottom_right)

        //if block is in top row
        if(blockIdx < blocksPerRow)
            notBlocksAround.push(top_left, top, top_right)

        //if block is in bottom row
        
        if(blockIdx >= difficulty.blocks-blocksPerRow-1 && blockIdx <= difficulty.blocks-1)
            notBlocksAround.push(bottom_left, bottom, bottom_right)

        //delete duplicated posible mines
        notBlocksAround = notBlocksAround.filter((posible, index) => blocksAround.indexOf(posible === index))

        notBlocksAround.map(notPossible => {
            blocksAround = blocksAround.filter(possible => possible !== notPossible)
        })

        return blocksAround
    }

    const getNearbyMines = (blockIdx, blocksPerRow, expects) => {

        let possibleMines = getBlocksAround(blockIdx, blocksPerRow)

        possibleMines = possibleMines.filter(possible => {

            if(minesPosition.includes(possible)){
                return true
            }

            return false
        })

        

        if (expects === 'count')
            return possibleMines.length
        
        if(expects === 'array')
            return possibleMines
    }

    /**index: index of a block with Zero mines around. If some of the blocks around doesn't have a mine around either 
     *  the function automatically executes itself with this new block.
     * 
     * prevIteratedBlocks: Array variable to store blocks which have been iterated previously when the function 
     *  executes itself more than once
     */
    const zeroBlockClicked = (index, prevIteratedBlocks) => {

        if(!prevIteratedBlocks)
            prevIteratedBlocks = []

        let blocksToGenerate = difficulty.blocks
        let boardArea = board.current.offsetWidth * board.current.offsetHeight
        let blockArea = boardArea/blocksToGenerate
        let blockSize = Math.sqrt(blockArea)
        let blocksPerRow = Math.floor(board.current.offsetWidth/blockSize)

        let blocksAround = getBlocksAround(index, blocksPerRow)
        let arrayIndexToUnhide = []

        prevIteratedBlocks.push(index)
        blocks.array.map(block => {

            if(blocksAround.includes(block.index) && !prevIteratedBlocks.includes(block.index)){

                arrayIndexToUnhide.push(block.index)
                
                if(block.nearbyMines === 0)
                    zeroBlockClicked(block.index, prevIteratedBlocks).map(index => {
                        if(!arrayIndexToUnhide.includes(index))
                            arrayIndexToUnhide.push(index)
                    })
            }
            return block
        })
        
        return arrayIndexToUnhide
    }

    const handleBlockClicked = (index) => {

        let blocksToUnhide = []

        if(blocks.array[index].nearbyMines === 0){
            blocksToUnhide = zeroBlockClicked(index)
        }

        let safeBlocksLeft = blocksToUnhide.length > 0 
            ? blocks.safeBlocksLeft-blocksToUnhide.length-1 
            : blocks.safeBlocksLeft-1

        setBlocks({
            array: blocks.array.map(block => {
            
                if(block.index === index || blocksToUnhide.includes(block.index))
                    block.hidden = false
                
                return block
            }),
            safeBlocksLeft
        })

        console.log('safeBlocksLeft', safeBlocksLeft)
        if(safeBlocksLeft === 0)
            handleGameEnd('win')

    }

    const handleFlagAdd = () =>{
        onFlagAdd()
    }

    const handleFlagSubstract = () => {
        onFlagSubstract()
    }

    const blockGenerator = (boardWidth, boardHeight) => {
        try {
            let array = []

            let blocksToGenerate = difficulty.blocks
            let boardArea = boardWidth * boardHeight
            let blockArea = boardArea/blocksToGenerate
            let blockSize = Math.sqrt(blockArea)
            let blocksPerRow = Math.floor(boardWidth/blockSize)
            // console.log('blocksToGenerate', blocksToGenerate);
            // console.log('blockSize', blockSize);
    
            //console.log(minesLocation);

            for(let i = 0; i < blocksToGenerate; i++)
                array.push('')
        
            
            let locationIndx = 0
            setBlocks({

                array: array.map((value, index) => {
                    
                    let isMine = index === minesPosition[locationIndx]

                    const nearbyMines = getNearbyMines(index, blocksPerRow, 'count')

                    if(isMine){
                        locationIndx++
                    }

                    return {
                        index,
                        size: `${blockSize}px`,
                        text: index,
                        isMine,
                        nearbyMines,
                        flagEnabled,
                        hidden: true
                    }
                }),
                safeBlocksLeft: difficulty.blocks - difficulty.mines
                
            })
        }
        catch(e){console.error(e)}
      }
    

    const handleClick = () => {
        if(!gameStarted){
            onGameStarted()
            setGameStarted(true)
        }

        
    }

    const handleGameEnd = (result) => {
        onGameEnded(result)
        setGameStarted(false)
    }

    useEffect(() => {
        if(!gameStarted){
        blockGenerator(board.current.offsetWidth, board.current.offsetHeight)
        setMinesPosition(generateMinesPosition())}
    }, [difficulty, gameStarted])

    useEffect(() => {
        blockGenerator(board.current.offsetWidth, board.current.offsetHeight)
    }, [flagEnabled, minesPosition])

    return(
        
        <div ref={board} className='board' onContextMenu={handleClick} onClick={handleClick}>
            {//Si ya se descubrieron todos los bloques no que no son bombas
            blocks && blocks.array.map(block => {

                return <Block 
                index={block.index}
                key={block.index} 
                size={block.size} 
                text={block.index} 
                mine={block.isMine} 
                nearbyMines={block.nearbyMines}
                onBlockClicked={handleBlockClicked}
                onGameEnd={handleGameEnd}
                onFlagSubstract={handleFlagSubstract}
                onFlagAdd={handleFlagAdd}
                flagEnabled={block.flagEnabled}
                lastBlock={blocks.safeBlocksLeft === 1 && !block.isMine ? true : false}
                isHidden={block.hidden}/>})
            }
        </div>
        
    )
}

export default Board