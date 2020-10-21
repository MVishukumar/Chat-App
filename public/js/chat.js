console.log('Client JS loaded..........');

const socket = io();

socket.on('countUpdated', (count) => {
    console.log('countUpdated event:' , count);
});

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked');
//     socket.emit('increment')
// });

// Elements
const $chatForm = document.querySelector('#chatForm');
const $chatFormInputMessage = $chatForm.querySelector('#message');
const $chatFormSubmitButton = $chatForm.querySelector('#submit');
const $sendLocationButton = document.querySelector('#sendLocation');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplete = document.querySelector('#location-message-template').innerHTML;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.created).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationMessageTemplete, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});


$chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    $chatFormSubmitButton.setAttribute('disabled', 'disabled');

    //const message = document.querySelector('#message').value;
    const message = event.target.message.value;

    socket.emit('sendMessage', message, (callbackMessage) => {
        $chatFormSubmitButton.removeAttribute('disabled')
        $chatFormInputMessage.value = '';
        $chatFormInputMessage.focus();
        console.log(callbackMessage);
    });
})

document.querySelector('#sendLocation').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not available');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        $sendLocationButton.setAttribute('disabled', 'disabled');
        console.log(position);

        console.log(position.coords.latitude, position.coords.longitude);

        socket.emit('sendLocation', {lat: position.coords.latitude, long: position.coords.longitude}, (ackServer) => {
            $sendLocationButton.removeAttribute('disabled');
            console.log(ackServer);
        });

    });
});