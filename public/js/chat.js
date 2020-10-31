$(document).ready(function () {
	alert('Client JS loaded..........');

	const socket = io();

	socket.on('countUpdated', (count) => {
		console.log('countUpdated event:', count);
	});

	// document.querySelector('#increment').addEventListener('click', () => {
	//     console.log('Clicked');
	//     socket.emit('increment')
	// });

	// Elements
	const $chatForm = document.querySelector('#chatForm');
	const $chatFormInputMessage = $chatForm.querySelector('#message');
	const $chatFormSubmitButton = $chatForm.querySelector('#submit');
	//const $sendLocationButton = document.querySelector('#sendLocation');
	const $messages = document.querySelector('#messages');

	// Templates
	const messageTemplate = document.querySelector('#message-template')
		.innerHTML;
	const locationMessageTemplete = document.querySelector(
		'#location-message-template'
	).innerHTML;
	const sidebarTemplete = document.querySelector('#sidebar-template')
		.innerHTML;
	const headerTemplete = document.querySelector('#header-template').innerHTML;

	// Options
	const { username, room } = Qs.parse(location.search, {
		ignoreQueryPrefix: true,
	});

	const autoscroll = () => {
		$('#thisScrolls')
			.stop()
			.animate(
				{
					scrollTop: $('#thisScrolls')[0].scrollHeight,
				},
				1000
			);
		// const $newMessage = $messages.lastElementChild;
		// const $newMessageStyles = getComputedStyle($newMessage);
		// const $newMessageMargin = parseInt($newMessageStyles.marginBottom);
		// const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin;
		// const $visibleHeight = $messages.offsetHeight;
		// const $containerHeight = $messages.scrollHeight;
		// const $scrollOffset = $messages.scrollTop + $visibleHeight;
		// console.log(
		// 	`$containerHeight = ${$containerHeight}, $newMessageHeight = ${$newMessageHeight}, $scrollOffset = ${$scrollOffset}`
		// );
		// console.log(`$messages.scrollHeight = ${$messages.scrollHeight}`);
		// if ($containerHeight - $newMessageHeight <= $scrollOffset) {
		// 	$messages.scrollTop = $messages.scrollHeight;
		// }
	};

	socket.on('message', (message) => {
		console.log(message);
		const html = Mustache.render(messageTemplate, {
			username: message.username,
			message: message.text,
			createdAt: moment(message.created).format('LT'),
		});
		$messages.insertAdjacentHTML('beforeend', html);
		autoscroll();
	});

	socket.on('locationMessage', (message) => {
		console.log(message);
		const html = Mustache.render(locationMessageTemplete, {
			username: message.username,
			url: message.url,
			createdAt: moment(message.createdAt).format('h:mm a'),
		});
		$messages.insertAdjacentHTML('beforeend', html);
		autoscroll();
	});

	socket.on('roomData', ({ room, users }) => {
		const html = Mustache.render(sidebarTemplete, {
			room,
			users,
		});

		document.querySelector('#sidebar').innerHTML = html;
		//$messages.insertAdjacentHTML('beforeend', html);

		const html2 = Mustache.render(headerTemplete, {
			room,
		});
		document.querySelector('#roomHeader').innerHTML = html2;
	});

	$chatForm.addEventListener('submit', (event) => {
		event.preventDefault();

		$chatFormSubmitButton.setAttribute('disabled', 'disabled');

		//const message = document.querySelector('#message').value;
		const message = event.target.message.value;

		socket.emit('sendMessage', message, (callbackMessage) => {
			$chatFormSubmitButton.removeAttribute('disabled');
			$chatFormInputMessage.value = '';
			$chatFormInputMessage.focus();
			console.log(callbackMessage);
		});
	});

	// document.querySelector('#sendLocation').addEventListener('click', () => {
	// 	if (!navigator.geolocation) {
	// 		return alert('Geolocation not available');
	// 	}

	// 	navigator.geolocation.getCurrentPosition((position) => {
	// 		$sendLocationButton.setAttribute('disabled', 'disabled');
	// 		console.log(position);

	// 		console.log(position.coords.latitude, position.coords.longitude);

	// 		socket.emit(
	// 			'sendLocation',
	// 			{ lat: position.coords.latitude, long: position.coords.longitude },
	// 			(ackServer) => {
	// 				$sendLocationButton.removeAttribute('disabled');
	// 				console.log(ackServer);
	// 			}
	// 		);
	// 	});
	// });

	socket.emit('join', { username, room }, (callback) => {
		if (callback) {
			alert(callback);
			location.href = '/';
		}
	});
});
