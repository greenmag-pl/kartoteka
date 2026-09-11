function getImg()
{

	$('#opis img').css(
	{
		'background-image': $('#karta' + $('#opis span').attr('id')).css('background-image')
	});

}

function De(s)
{

	let wynik = '';
	for (let i = 0; i < s.length; i++)
		{
			wynik += s.charCodeAt(i).toString();
		}
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
					getImg();
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
					getImg();
					$('#opis>button').fadeIn('normal');
				};
			})
			.fail(function()
			{
				$('#opis').css('padding', '0px').html('<p>Niewłaściwy parametr karty.</p>').show();
			});
		$('body').css('overflow', 'hidden');
	}
	else
	{
		let userPass = new URLSearchParams(location.search).get('klucz');
		if (userPass === null) userPass = '';
		userPass = De(userPass);
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
			$('#opis').html('<div>' + _id.find('span').text() + '</div>' + data + '<img><button>Wstecz</button>').slideDown('fast', function ()
			{
				$('#opis span').attr('id', _id.attr('id').replace('karta', ''));
				getImg();
				$('#opis>button').fadeIn('normal');
			}).scrollTop(0);
			$('body').css('overflow', 'hidden');
		});
	});

	$('#stopka').prepend('© 2025-' + new Date().getFullYear() + ' ').click(function()
	{
		window.location.href = 'https://greenmag-pl.github.io/kartoteka';
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
		let result = url.origin + url.pathname + '?karta=' + this.id + '&wstecz';
		if (navigator.share) navigator.share({title: $('#opis div:first').text(), url: result});
		else navigator.clipboard.writeText(result);
	});

});