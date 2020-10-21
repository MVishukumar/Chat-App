console.log('Client JS loaded..........');

const socket = io();

socket.on('countUpdated', (count) => {
    console.log('countUpdated event:' , count);
});

document.querySelector('#increment').addEventListener('click', () => {
    console.log('Clicked');
    socket.emit('increment')
});

