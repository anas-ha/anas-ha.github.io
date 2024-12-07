; (function () {

	'use strict';

	var isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};


	var fullHeight = function () {

		if (!isMobile.any()) {
			/* $('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			}); */
		}
	};

	// Parallax
	var parallax = function () {
		$(window).stellar();
	};

	var contentWayPoint = function () {
		var i = 0;
		$('.animate-box').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function () {

					$('body .animate-box.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						}, k * 100, 'easeInOutExpo');
					});

				}, 50);

			}

		}, { offset: '85%' });
	};



	var goToTop = function () {

		$('.js-gotop').on('click', function (event) {

			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');

			return false;
		});

		$(window).scroll(function () {

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});

	};
	var goToBottom = function () {

		$('.lets-collaborate').on('click', function (event) {

			event.preventDefault();

			$('html, body').animate({
				scrollTop: $(document).height() - $(window).height()
			}, 500, 'easeInOutExpo');

			return false;
		});

		/* $(window).scroll(function(){
	
			var $win = $(window);
			if ($win.scrollTop() + $win.height() < $(document).height() - 200) {
				$('.js-bottom').addClass('active');
			} else {
				$('.js-bottom').removeClass('active');
			}
	
		}); */

	};


	var pieChart = function () {
		$('.chart').easyPieChart({
			scaleColor: false,
			lineWidth: 4,
			lineCap: 'butt',
			barColor: '#FF9000',
			trackColor: "#f5f5f5",
			size: 160,
			animate: 1000
		});
	};

	var skillsWayPoint = function () {
		if ($('#fh5co-skills').length > 0) {
			$('#fh5co-skills').waypoint(function (direction) {

				if (direction === 'down' && !$(this.element).hasClass('animated')) {
					setTimeout(pieChart, 400);
					$(this.element).addClass('animated');
				}
			}, { offset: '90%' });
		}

	};

	var form = function () {
		// find elements
		$("#staticform").submit(function (event) {
			event.preventDefault();
			$.ajax({
				url: 'https://api.staticforms.xyz/submit', 
				type: "POST",
				dataType: 'json',
				data: $("#staticform").serialize(),
				success: function (result) {
					if (result && result.success === true) {
						$("#staticform")[0].reset();
						$('#success-message').show();
					}
				},
				error: function (xhr, resp, text) {
					const xhrDetails = typeof xhr === "object" ? JSON.stringify(xhr, null, 2) : xhr;
					const respDetails = typeof resp === "object" ? JSON.stringify(resp, null, 2) : resp;

					const errorDetails = `
						XHR: ${xhrDetails}
						Response: ${respDetails}
						Text: ${text}
					`;

					$('#error-message-code').html(errorDetails.replace(/\n/g, '<br>'));
					$('#error-message').show();
				}
			})
		});
	};

	var loaderPage = function () {
		$(".fh5co-loader").fadeOut("slow");
	};

	var includeHtmlParts = function () {
		return new Promise((resolve) => {
			var z = $("[include-html-part]");
			var loadCount = 0; // Track loaded parts
			if (z.length === 0) {
				resolve(); // No parts to load
				return;
			}

			z.each(function () {
				var elmnt = this;
				var file = elmnt.getAttribute("include-html-part");
				if (file) {
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function () {
						if (this.readyState == 4) {
							if (this.status == 200) {
								elmnt.innerHTML = this.responseText;
							}
							if (this.status == 404) {
								elmnt.innerHTML = "Page not found.";
							}
							elmnt.removeAttribute("include-html-part");
							loadCount++; // Increment count after each load
							if (loadCount === z.length) {
								resolve(); // Resolve promise when all parts are loaded
							}
						}
					};
					xhttp.open("GET", file, true);
					xhttp.send();
				}
			});
		});
	};

	$(function () {
		includeHtmlParts().then(() => {

			contentWayPoint();
			goToTop();
			goToBottom();
			loaderPage();
			fullHeight();
			parallax();
			// pieChart();
			skillsWayPoint();
			form();
		});
	});


}());