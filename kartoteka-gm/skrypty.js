$(function()
{

	let userPass = new URLSearchParams(location.search).get("klucz");
	if (userPass === null) userPass = "";
	$.get("klucz.txt", function(realPass)
	{
		if (userPass !== realPass) $('body').html('<img src="stop.png"><p>Brak dostępu.</p>');

	});

	const userCard = new URLSearchParams(location.search).get("karta");
	if (userCard)
	{
		const nazwa = '<div>' + $('#karta' + userCard).find('span').text() + '</div>';
		$.get('karty/karta' + userCard + '/dane.txt', function(data)
		{
			if (new URLSearchParams(location.search).get("wstecz") === null)
			{
				$('#opis').html(nazwa + data).show().scrollTop(0);
				$('#opis').css('padding-bottom', '100px');
				$('#opis span').html('&nbsp;');
				$(document).off('click', '#opis span').on('click', '#opis span', function()
				{
					if (navigator.share) navigator.share({title: $('#opis div:first').text(), url: window.location.href});
					else navigator.clipboard.writeText(window.location.href);
				});
			}
			else
			{
				$('#opis').html(nazwa + data + '<button>Wstecz</button>').show().scrollTop(0);
				$('#opis>button').fadeIn('normal');
			};
			$('body').css('overflow', 'hidden');	
		});
	};

	$('#tytul').click(function()
	{
		window.location.href = 'https://greenmag-pl.github.io/kartoteka';
	});

	$('div[id^="karta"]')
	.wrapInner('<span></span>')
	.css('background-image', function()
	{
		return 'url("karty/' + this.id + '/obraz.jpg")';
	})
	.click(function()
	{
		const nazwa = $(this).find('span').text();
		$.get('karty/' + this.id + '/dane.txt', function(data)
		{
			$('#opis').html('<div>' + nazwa + '</div>' + data + '<button>Wstecz</button>').slideDown('fast', function ()
			{
				$('#opis>button').fadeIn('normal');
			}).scrollTop(0);
			$('body').css('overflow', 'hidden');
		});
	});

	$(document).on('click', '#opis>button', function()
	{
		$(this).hide();
        	$('#opis').slideUp('fast');
		$('body').css('overflow', 'auto');
	});

	$(document).on('click', '#opis span', function()
	{
		const url = new URL(window.location.href);
		const value = url.searchParams.get('klucz');
		let result = url.origin + url.pathname;
		let beforeSlash = $(this).text().split('/')[0];
		if (value) result += '?klucz=' + value + '&'; else result += '?';
		result += 'karta=' + beforeSlash + '&wstecz';
		if (navigator.share) navigator.share({title: $('#opis div:first').text(), url: result});
		else navigator.clipboard.writeText(result);
	});

});