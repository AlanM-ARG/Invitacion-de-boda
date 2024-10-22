document.addEventListener('DOMContentLoaded', (event) => {
    // Importa luxon
    const { DateTime, Duration } = luxon;

    // Define la fecha objetivo en la zona horaria de Argentina
    const targetDate = DateTime.fromObject({
        year: 2024,
        month: 12,
        day: 7,
        hour: 9,
        minute: 0,
        second: 0
    }, { zone: 'America/Argentina/Buenos_Aires' });

    const timerElement = document.getElementById('timer');
    // const cardElement = document.getElementById('card');

    function updateTimer() {
        const now = DateTime.now().setZone('America/Argentina/Buenos_Aires'); // Fecha y hora actuales en la zona horaria de Argentina
        const timeRemaining = targetDate.diff(now); // Diferencia en milisegundos

        if (timeRemaining.as('milliseconds') <= 0) {
            clearInterval(myInterval);
            timerElement.textContent = '00:00:00:00';
            // cardElement.style.display = 'block'; // Muestra lo que quieres cuando el temporizador termine
            return;
        }

        const duration = Duration.fromMillis(timeRemaining.toMillis());
        const days = Math.floor(duration.as('days'));
        const hours = Math.floor(duration.as('hours') % 24);
        const minutes = Math.floor(duration.as('minutes') % 60);
        const seconds = Math.floor(duration.as('seconds') % 60);

        timerElement.textContent = 
            `${days < 10 ? '0' + days : days}:` +
            `${hours < 10 ? '0' + hours : hours}:` +
            `${minutes < 10 ? '0' + minutes : minutes}:` +
            `${seconds < 10 ? '0' + seconds : seconds}`;
    }

    const myInterval = setInterval(updateTimer, 1000);

    const audio = document.getElementById("miAudio");

    // Función para reproducir el audio
    function reproducir() {
        audio.play();
    }

    // Función para pausar el audio
    function pausar() {
        audio.pause();
    }
});
