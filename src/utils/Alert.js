import Swal from 'sweetalert2'

const GameEnd = (win, timeLeft, fnRestart) => {

    Swal.fire({
        title: win ? 'YOU WIN!🎉🎉🎉' : 'YOU LOSE 😭😭😭',
        text: `${timeLeft} seconds.`,
        confirmButtonText: 'Restart'
    }).then((result) => {
        if(result.value){
            fnRestart()
        }
    })
}

export default {
    GameEnd
}