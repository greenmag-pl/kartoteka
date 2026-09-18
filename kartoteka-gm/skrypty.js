function getNrAndImg(wstecz)
{
	$('#opis>div').eq(1).append('<span>&nbsp;</span>');
	if (wstecz) $('#opis span').text($('body>div[id^="karta"]').index($('#karta' + $('#opis').data('nr'))) + 1 + '/' + $('body>div[id^="karta"]').length);
	const img = new Image();
	img.onload = function()
	{
		$('#opis>img').css('background-image', 'url("' + img.src + '")');
	};
	img.onerror = function()
	{
		$('#opis>img').css('background-image', 'url("brak.jpg")');
	};
	img.src = 'karty/karta' + $('#opis').data('nr') + '/obraz.jpg';
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
				$('#opis').data('nr', userCard);
				if (new URLSearchParams(location.search).get('wstecz') === null)
				{
					$('#opis').html('<div>' + $('#karta' + userCard).text() + '</div>' + data + '<img>').show().scrollTop(0);
					getNrAndImg(false);
				}
				else
				{
					$('#opis').html('<div>' + $('#karta' + userCard).text() + '</div>' + data + '<img><button>Wstecz</button>').show().scrollTop(0);
					getNrAndImg(true);
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

	$('div[id^="karta"]').wrapInner('<span></span>').each(function()
	{
		const _id = $(this);
		const img = new Image();
		img.onload = function()
		{
			_id.css('background-image', 'url("' + img.src + '")');
		};
		img.onerror = function()
		{
			_id.css('background-image', 'url("brak.jpg")');
		};
		img.src = 'karty/' + this.id + '/obraz.jpg';
		})
	.click(function()
	{
		const _id = $(this);
		$.get('karty/' + this.id + '/dane.txt', function(data)
		{
			$('#opis').data('nr', _id.attr('id').replace('karta', ''));
			$('#opis').html('<div>' + _id.text() + '</div>' + data + '<img><button>Wstecz</button>').slideDown('fast').scrollTop(0);
			getNrAndImg(true);
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
		window.open('notatki.html?nazwa=' + encodeURIComponent($('#opis>div:first').text()) + '&karta=' + $('#opis').data('nr'), '_blank');
	});

	$('#opis').on('click', '>button', function()
	{
		$(this).hide();
		$('#opis').slideUp('fast');
		$('body').css('overflow', 'auto');
		$('#opis').data('nr', '0');
	});

	$('#opis').on('click', 'span', function()
	{
		let result;
		if ($('#opis span').html() === '&nbsp;') result = window.location.href;
		else
		{
			const url = new URL(window.location.href);
			result = url.origin + url.pathname + '?karta=' +  $('#opis').data('nr') + '&wstecz';
		}
		if (navigator.share) navigator.share({title:document.title, text:$('#opis>div:first').text()+'\n', url:result});
		else navigator.clipboard.writeText(result);
	});

});