jQuery(window).load(function() {
	jQuery('.read-more').click(function(e){
		if(jQuery(this).attr("href") == null) {
			$this = jQuery(this).next().find('a');
		}
		else {
			$this = jQuery(this);	
		}
		e.preventDefault();	
		window.location.hash = '#popup_' +  $this.attr("id");
		jQuery('.dryThemePopupHolder').empty();
		jQuery('.dryThemePopupHolder').load($this.attr("href"), function(){
			jQuery("<a/>").prependTo('article.modal .article-content')
			.addClass('popup-close')
			.hover(function(){
				jQuery(this).find('img').css({
					'margin-top':'-80px'
				});
			}, function() {
				jQuery(this).find('img').css({
					'margin-top':'0px'
				});
			})
			.append(jQuery("<div/>")
					.addClass('image-holder')
					.append(jQuery("<img/>").attr({
								src: 'images/close_post.png',
								alt: ''					
							}).addClass('absolute')));
			
			var $modal = jQuery('.dryThemePopupHolder article.modal')
				.center({
					minY: ($(window).scrollTop() < $('#main-menu').parent().offset().top) ? 10 : parseInt($('#main-menu').position().top + 110)
				})
				.omniWindow({			
					modal: {
						hideClass: 'hidden'
					},
					callbacks: { 
						positioning: function(subjects) {
							subjects.modal.css('margin-left','0px');
						},
						afterHide: function(subjects, internalCallback) { 
							jQuery('.dryThemePopupHolder').empty();
						}
					}
				})
				.trigger('show');
	
			// Fix for Vimeo Video to be Full Screen
			jQuery(".vimeo").each(function() {
				var vimeo_width = jQuery(this).width();    
				var vimeo_height = vimeo_width*16*7/(90*2.2);
				jQuery(this).find('iframe').css('height',vimeo_height);    
			});
	
			$('.popup-close').click(function(e){
				e.preventDefault();
				$modal.trigger('hide');
			});
		});
			
	});
	var hashID = window.location.hash.replace("popup_", "");
	jQuery(hashID).trigger('click');
});	
jQuery(window).resize(function(){
	jQuery('.dryThemePopupHolder article').center({
		minY:parseInt($('#main-menu').position().top + 110)
	});
	
	  // Fix for Vimeo Video to be Full Screen
    jQuery(".vimeo").each(function() {
        var vimeo_width = jQuery(this).width();    
        var vimeo_height = vimeo_width*16*7/(90*2.2);
        jQuery(this).find('iframe').css('height',vimeo_height);    
    });  
});