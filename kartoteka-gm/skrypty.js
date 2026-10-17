function getTitle()
{
	return $('#karta' + $('#opis').data('nr')).text();
}

function loadImg(target, src)
{
	const img = new Image();
	img.onload = function()
	{
		$(target).css('background-image', 'url("' + img.src + '")');
	};
	img.onerror = function()
	{
		$(target).css('background-image', 'url("brak.jpg")');
	};
	img.src = 'karty/' + src  + '/obraz.jpg';
}

function getDetal(full)
{
	$('#opis>div').eq(1).append('<span>&nbsp;</span>');
	if (full) $('#opis span').text($('body>div[id^="karta"]').index($('#karta' + $('#opis').data('nr'))) + 1 + '/' + $('body>div[id^="karta"]').length);
	else $('a').replaceWith('<i>Niedostępne</i>');
	loadImg('#opis>img', 'karta' + $('#opis').data('nr'));
}

function De()
{
	let userPass = new URLSearchParams(location.search).get('klucz');
	if (userPass === null) userPass = ''; else
	{
		const t = [40, 123, 91, 60, 47, 92, 62, 93, 125, 41];
		let wynik = '';
		for (let i = 0; i < userPass.length; i++) wynik += (userPass.charCodeAt(i) + i).toString();
		for (let i = 0; i < t.length; i++) wynik = wynik.replaceAll(i.toString(), String.fromCharCode(t[i]));
		userPass = wynik;
	}
	return $.get('physicalpass').then(function(realPass)
	{
		return userPass === realPass;
	});
}

$(function()
{
	$('body').append('<div id="opis"></div>');
	const userCard = new URLSearchParams(location.search).get('karta');
	if (userCard)
	{
		$.get('karty/karta' + userCard + '/dane.txt')
			.done(function(data)
			{
				$('#opis').data('nr', userCard);
				De().then(function(wynik)
				{
					if (wynik)
					{
						$('#opis').html('<div>' + getTitle() + '</div>' + data + '<img><button>Wstecz</button>').show().scrollTop(0);
						$('#opis>button').fadeIn('normal');
					}
					else
						$('#opis').html('<div>' + getTitle() + '</div>' + data + '<img>').show().scrollTop(0);
					getDetal(wynik);
				});
				$('body').css('overflow', 'hidden');
			})
			.fail(function()
			{
				$('body').html('<p>Niewłaściwy parametr karty.</p>');
			});
	}
	else
	{
		De().then(function(wynik)
		{
			if (!wynik) $('body').html('<p>Niewłaściwy klucz dostępu.</p>');
		});
	}

	$('div[id^="karta"]').wrapInner('<span></span>').each(function()
	{
		loadImg(this, this.id);
	})
	.click(function()
	{
		$('#opis').data('nr', this.id.replace('karta', ''));
		$.get('karty/' + this.id + '/dane.txt', function(data)
		{
			$('#opis').html('<div>' + getTitle() + '</div>' + data + '<img><button>Wstecz</button>').slideDown('fast', function()
			{
				$('#opis>button').fadeIn('normal');
			}).scrollTop(0);
			getDetal(true);
			$('body').css('overflow', 'hidden');
		});
	});

	$('#stopka').prepend('© 2025-' + new Date().getFullYear() + ' ').click(function()
	{
		window.location.href = 'https://greenmag-pl.github.io/kartoteka';
	});

	$('#opis').on('click', '>a', function()
	{
		window.open('notatki.html?nazwa=' + encodeURIComponent(getTitle()) + '&karta=' + $('#opis').data('nr'), '_blank');
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
			const userPass = new URLSearchParams(location.search).get('klucz');
			if (userPass === null) result = url.origin + url.pathname + '?karta=' +  $('#opis').data('nr');
			else result = url.origin + url.pathname + '?klucz=' + userPass + '&karta=' +  $('#opis').data('nr');
		}
		if (navigator.share) navigator.share({title:document.title + '-' + getTitle(), url:result});
		else navigator.clipboard.writeText(result);
	});

});