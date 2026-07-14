$(function()
{

	const userCard = new URLSearchParams(location.search).get("karta");
	if (userCard)
	{
		$.get('karty/karta' + userCard + '/dane.txt')
			.done(function(data)
			{
				if (new URLSearchParams(location.search).get("wstecz") === null)
				{
					$('#opis').html('<div>' + $('#karta' + userCard).text() + '</div>' + data).show().scrollTop(0);
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
					$('#opis').html('<div>' + $('#karta' + userCard).text() + '</div>' + data + '<button>Wstecz</button>').show().scrollTop(0);
					$('#opis>button').fadeIn('normal');
				};
			})
			.fail(function()
			{
				$('#opis').html('<p style="margin-top:100px;">Brak dostępu.<br>Niewłaściwy parametr karty!</p>').show();
			});
		$('body').css('overflow', 'hidden');
	}
	else
	{
		let userPass = new URLSearchParams(location.search).get("klucz");
		if (userPass === null) userPass = "";
		$.get("physicalpass", function(realPass)
		{
			if (userPass !== realPass) $('body').html('<p>Brak dostępu.<br>Niewłaściwy klucz dostępu!</p>');
		});
	};

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

	$('#stopka')
	.prepend('© 2025-' + new Date().getFullYear() + ' ')
	.click(function()
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