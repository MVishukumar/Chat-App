$(document).ready(function () {
	$('#submit').click(function () {
		$('#thisScrolls')
			.stop()
			.animate(
				{
					scrollTop: $('#thisScrolls')[0].scrollHeight,
				},
				1000
			);
	});

	$('#sendLocation').click(function () {
		$('#thisScrolls')
			.stop()
			.animate({
				scrollTop: $('#thisScrolls')[0].scrollHeight,
			});
	});
});
