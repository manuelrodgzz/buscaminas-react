import Swal from 'sweetalert2'

const GameEnd = (win, timeLeft, fnRestart) => {

    
    Swal.fire({
        title: win ? '¡GANASTE!🎉🎉🎉' : '¡PERDISTE! 😭😭😭',
        text: `${timeLeft} segundos.`,
        confirmButtonText: 'Reiniciar'
    }).then((result) => {
        if(result.value){
            fnRestart()
        }
    })
}

export default {
    GameEnd
}