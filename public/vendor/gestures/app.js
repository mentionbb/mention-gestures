if (window.jQuery === undefined) jQuery = $ = {};

!function($, window, document)
{
	"use strict";

	window.addEventListener('wheel', function (e) {
		Math.sign(e.deltaY);
	});
	
	function mentionGestureRenderer() {
		$('[data-template="discussion"] .post-content').each(function (index) {
			var elem = $(this).closest('.post');

			var likeContainer = (function (likeType, $) {
				if (elem.find('[data-ui="take-like-post"]').length === 0) {
					elem.find('[data-ui="like-post"] [data-ui="like-post"][data-reaction="' + likeType + '"]').click();

					elem.find('.app-post-doubletap-like .app-reactions .reaction.' + likeType + '').removeClass('d-none');
					elem.find('.app-post-doubletap-like').removeClass('d-none');
					elem.find('.app-post-doubletap-like').addClass('show');

					setTimeout(function () {
						elem.find('.app-post-doubletap-like').addClass('d-none')
							.removeClass('show');
						elem.find('.app-post-doubletap-like .app-reactions .reaction.' + likeType + '').addClass('d-none');
					}, 1000);
				}
			});

			var h = new Hammer.Manager(this, {
				recognizers: [
					[Hammer.Swipe,{ direction: Hammer.DIRECTION_HORIZONTAL }]
				]
			});
			
			var Press = new Hammer.Press({
				time: 500
			});

			var DoubleTap = new Hammer.Tap({
				event: 'doubletap',
				taps: 2
			});

			var TripleTap = new Hammer.Tap({
				event: 'tripletap',
				taps: 3
			});

			h.add([Press, DoubleTap, TripleTap]);

			TripleTap.recognizeWith(DoubleTap);
			
			DoubleTap.requireFailure(TripleTap);

			h.on('doubletap', function (event) {
				likeContainer('like');
			});

			h.on('tripletap', function (event) {
				likeContainer('dislike');
			});

			h.on('press', function (event) {
				elem.find('[data-ui="take-like-post"]').click();
			});

			if (!app.isMobile()) {
				h.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
				h.on('swipeleft', function (event) {
					likeContainer('wow');
				});

				h.on('swiperight', function (event) {
					likeContainer('angry');
				});

				h.on('swipeup', function (event) {
					likeContainer('haha');
				});

				h.on('swipedown', function (event) {
					likeContainer('sad');
				});
			}

			elem.on('click', '[data-ui="mention-gesture"][data-mode="disable"]', function (e) {
				e.preventDefault();
		
				if ($(this).hasClass('active')) {
					$(this).closest('.post-content').removeAttr('style');

					h.get('swipe').set({
						direction: Hammer.DIRECTION_NONE
					});

					$(this).removeClass('active')
						.addClass('disable');

					$(this).attr('data-mode', 'enable');
				}
			});

			elem.on('click', '[data-ui="mention-gesture"][data-mode="enable"]', function (e) {
				e.preventDefault();

				if ($(this).hasClass('disable')) {
					$(this).closest('.post-content').css({
						'touch-action': 'none',
						'user-select': 'none',
						'-webkit-user-drag': 'none',
						'-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
					});

					h.get('swipe').set({
						direction: Hammer.DIRECTION_ALL
					});

					$(this).removeClass('disable')
						.addClass('active');

					$(this).attr('data-mode', 'disable');
				}
			});
		});
	};

    $(document).bind('ajaxStop', function() {
		mentionGestureRenderer();
	});

	$(document).ready(function() {
		mentionGestureRenderer();
	});
}
(window.jQuery, window, document);