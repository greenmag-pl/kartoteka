function getImgAndTitle()
{
	$('#opis>img').attr('src', 'karty/karta' + $('#opis span').attr('id') + '/obraz.jpg');
	document.title = 'Kartoteka Zegarków - ' + $('#opis div:first').text();
}

function De(s)
{
	const t = [40, 123, 91, 60, 47, 92, 62, 93, 125, 41];
	let wynik = '';
	for (let i = 0; i < s.length; i++) wynik += s.charCodeAt(i).toString();
	for (let i = 0; i < t.length; i++) wynik = wynik.replaceAll(i.toString(), String.fromCharCode(t[i]));
	return wynik;
}

$(function()
{

	const userCard = new URLSearchParams(location.search).get('karta');
	if (userCard)
	{
		$.get('karty/karta' + userCard + '/dane.txt')
			.done(function(data)
			{
				if (new URLSearchParams(location.search).get('wstecz') === null)
				{
					$('#opis').html('<div>' + $('#karta' + userCard).text() + '</div>' + data + '<img>').show().scrollTop(0);
					$('#opis span').html('&nbsp;');
					$('#opis span').attr('id', userCard);
					getImgAndTitle();
					$(document).off('click', '#opis span').on('click', '#opis span', function()
					{
						if (navigator.share) navigator.share({title: $('#opis div:first').text(), url: window.location.href});
						else navigator.clipboard.writeText(window.location.href);
					});
				}
				else
				{
					$('#opis').html('<div>' + $('#karta' + userCard).text() + '</div>' + data + '<img><button>Wstecz</button>').show().scrollTop(0);
					$('#opis span').attr('id', userCard);
					getImgAndTitle();
					$('#opis>button').fadeIn('normal');
				};
				$('body').css('overflow', 'hidden');
			})
			.fail(function()
			{
				$('body').html('<p>Niewłaściwy parametr karty.</p>');
			});
	}
	else
	{
		let userPass = new URLSearchParams(location.search).get('klucz');
		if (userPass === null) userPass = ''; else userPass = De(userPass);
		$.get('physicalpass', function(realPass)
		{
			if (userPass !== realPass) $('body').html('<p>Niewłaściwy klucz dostępu.</p>');
		});
	};

	$('div[id^="karta"]').wrapInner('<span></span>').css('background-image', function()
	{
		return 'url("karty/' + this.id + '/obraz.jpg")';
	})
	.click(function()
	{
		const _id = $(this);
		$.get('karty/' + this.id + '/dane.txt', function(data)
		{
			$('#opis').html('<div>' + _id.text() + '</div>' + data + '<img><button>Wstecz</button>').slideDown('fast').scrollTop(0);
			$('#opis span').attr('id', _id.attr('id').replace('karta', ''));
			getImgAndTitle();
			$('#opis>button').fadeIn('normal');
			$('body').css('overflow', 'hidden');
		});
	});

	$('#stopka').prepend('© 2025-' + new Date().getFullYear() + ' ').click(function()
	{
		window.location.href = 'https://greenmag-pl.github.io/kartoteka';
	});

	$('#opis').on('click', '>a', function()
	{
		window.open('notatki.html?nazwa=' + encodeURIComponent($('#opis div:first').text()) + '&karta=' + $('#opis span').attr('id'), '_blank');
	});

	$('#opis').on('click', '>button', function()
	{
		$(this).hide();
		$('#opis').slideUp('fast');
		$('body').css('overflow', 'auto');
		if ($('#tytul').text().length > 18) document.title = $('#tytul').text().replace('Kartoteka Zegarków', 'Kartoteka Zegarków - ');
		else document.title = $('#tytul').text();
	});

	$('#opis').on('click', 'span', function()
	{
		const url = new URL(window.location.href);
		let result = url.origin + url.pathname + '?karta=' + this.id + '&wstecz';
		if (navigator.share) navigator.share({title: $('#opis div:first').text(), url: result});
		else navigator.clipboard.writeText(result);
	});

});