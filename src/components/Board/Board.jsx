import React, {useState, useEffect, useRef} from 'react'
import './Board.css'
import Block from '../Block'

/**toggleGameStarted solo lo uso para reiniciar el componente Board cada que se cambia de dificultad */
const Board = ({flagEnabled, difficulty, onGameStarted, onGameEnded, onFlagSubstract, onFlagAdd}) => {

    const [gameStarted, setGameStarted] = useState(false)
    const [blocks, setBlocks] = useState(null)
    const [minesPosition, setMinesPosition] = useState([])

    const board = useRef()

    const blocksPerRow = Math.sqrt(difficulty.blocks)

    const style = {
        gridTemplateRows: `repeat(${blocksPerRow}, 1fr)`,
        gridTemplateColumns: `repeat(${blocksPerRow}, 1fr)`
    }

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
        
        if(blockIdx > difficulty.blocks-blocksPerRow-1 && blockIdx <= difficulty.blocks-1)
            notBlocksAround.push(bottom_left, bottom, bottom_right)

        //delete duplicated posible mines
        notBlocksAround = notBlocksAround.filter((posible, index) => blocksAround.indexOf(posible === index))

        notBlocksAround.map(notPossible => {
            blocksAround = blocksAround.filter(possible => possible !== notPossible)

            return notPossible
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
    const zeroBlockClicked = (index, prevIteratedBlocks, arrayIndexToUnhide) => {

        if(!prevIteratedBlocks)
            prevIteratedBlocks = []

        let blocksAround = getBlocksAround(index, blocksPerRow)
        arrayIndexToUnhide = arrayIndexToUnhide || [index]

        prevIteratedBlocks.push(index)
        if(!arrayIndexToUnhide.includes(index))
            arrayIndexToUnhide.push(index)

        blocks.array.map(block => {

            if(block.hidden && blocksAround.includes(block.index) && !prevIteratedBlocks.includes(block.index)){
                
                if(!arrayIndexToUnhide.includes(block.index))
                    arrayIndexToUnhide.push(block.index)
                
                if(block.nearbyMines === 0)
                    zeroBlockClicked(block.index, prevIteratedBlocks, arrayIndexToUnhide).map(index => {
                        if(!arrayIndexToUnhide.includes(index))
                            arrayIndexToUnhide.push(index)

                        return index
                    })
            }
            return block
        })
        
        return arrayIndexToUnhide
    }

    const handleBlockClicked = (index) => {

        let blocksToUnhide = []
        let isZeroBlock = false

        if(blocks.array[index].nearbyMines === 0){
            blocksToUnhide = zeroBlockClicked(index)
            isZeroBlock = true
        }

        console.log(index, blocksToUnhide.sort((a, b) => a-b))

        let safeBlocksLeft = blocksToUnhide.length > 0 
            ? blocks.safeBlocksLeft-blocksToUnhide.length
            : blocks.safeBlocksLeft-1

        setBlocks({
            array: blocks.array.map(block => {
            
                if(block.index === index || blocksToUnhide.includes(block.index))
                    block.hidden = false
                
                return block
            }),
            safeBlocksLeft
        })

        if(safeBlocksLeft === 0 && isZeroBlock)
            handleGameEnd('win')

    }

    const handleFlagAdd = (index) =>{
        onFlagAdd()
        setBlocks({
            ...blocks,
            array: blocks.array.map(block => {
                if(block.index === index)
                    block.hasFlag = true

                return block
            })
        })
    }

    const handleFlagSubstract = (index) => {
        onFlagSubstract()
        setBlocks({
            ...blocks,
            array: blocks.array.map(block => {
                if(block.index === index)
                    block.hasFlag = false

                return block
            })
        })
    }

    const blockGenerator = (boardWidth, boardHeight) => {
        try {
            let array = []

            // console.log('blocksToGenerate', blocksToGenerate);
            // console.log('blockSize', blockSize);
    
            //console.log(minesLocation);

            for(let i = 0; i < difficulty.blocks; i++)
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
                        /*El generar este ID me permite que cada que genere mas bloques, cambie el ID y
                        el componente Block se reinicie, así cada que termina una partida se quitan las banderas*/ 
                        id: Math.random().toString(36).substr(2, 9), //genero id unico
                        index,
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
        console.log('game end', result)
        onGameEnded(result)
        if(gameStarted)
            setGameStarted(false)
        else{
            blockGenerator(board.current.offsetWidth, board.current.offsetHeight)
            setMinesPosition(generateMinesPosition())
        }
    }

    useEffect(() => {
        if(!gameStarted || blocks.safeBlocksLeft === 0){

            blockGenerator(board.current.offsetWidth, board.current.offsetHeight)
            setMinesPosition(generateMinesPosition())
            console.log('game start')
        }
    }, [gameStarted])

    useEffect(() => {
        blockGenerator(board.current.offsetWidth, board.current.offsetHeight)
        setMinesPosition(generateMinesPosition())
        console.log('gamse start')
    }, [difficulty])

    useEffect(() => {
        
        blockGenerator(board.current.offsetWidth, board.current.offsetHeight)
    }, [minesPosition])


    useEffect(() => {
        if(blocks){
        setBlocks({
            ...blocks,
            array: blocks.array.map(block => {
                block.flagEnabled = flagEnabled
                
                return block
            })
        })
    }
    }, [flagEnabled])

    return(
        
        <div ref={board} className='board' style={style} onContextMenu={handleClick} onClick={handleClick}>
            {//Si ya se descubrieron todos los bloques no que no son bombas
            blocks && blocks.array.map(block => {

                return <Block 
                index={block.index}
                key={block.id} 
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