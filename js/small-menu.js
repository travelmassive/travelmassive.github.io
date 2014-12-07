
jQuery(window).load(function() {
							 
		var small_menu = '<div class="small-menu-wrapper"><select class="small-menu">';		
		jQuery('#main-menu aside ul:first').find('li').each(function(){
			var href = jQuery(this).find('a').first().attr('href');
			
			var title = jQuery(this).find('a').first().text();	
			
			small_menu += '<option value="'+href+'">'+title+'</option>';  			
		});		
		small_menu += '</select></div>';		
		jQuery('#main-menu aside ul:first').after(small_menu);
				
	
	
	if (jQuery(document).width() < 1000 ) { 
		
	   jQuery('#main-menu aside ul:first, .logo').hide();
	   jQuery('#main-menu aside').width('100%');
	   jQuery('.small-menu-wrapper').show();
    } 
	else {
	   jQuery('#main-menu aside ul:first, .logo').show();
	   jQuery('#main-menu aside').width('auto');
	 
	   jQuery('.small-menu-wrapper').hide();   
	}


	jQuery('.small-menu').change(function() {
		var goTo = jQuery(this).val();
		if (goTo.indexOf('http://') != -1){
			window.location.href = goTo;
		}
		else {
		jQuery('html, body').animate({
			scrollTop: jQuery(goTo).offset().top
			}, 800);
		}
	});	   

});

jQuery(window).resize(function(){
	
	if (jQuery(document).width() < 1000 ) {      
	   jQuery('#main-menu aside ul:first, .logo').hide();	 
	   jQuery('#main-menu aside').width('100%');
	   jQuery('.small-menu-wrapper').show();
    }
	else {
	   jQuery('#main-menu aside ul:first, .logo').show();
	   jQuery('#main-menu aside').width('auto');
	   jQuery('.small-menu-wrapper').hide();   
	}
	   
});

