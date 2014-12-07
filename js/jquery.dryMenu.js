$(window).bind('scroll resize', function() {	
										 
	var currentSection = null;
	
	$('.section').each(function(){
		var element = $(this).attr('id');		
		if($(window).scrollTop() >= $('#'+element).offset().top - 70)
		{
			currentSection = element;
		}
	});
	
	$('#main-menu ul li').removeClass('active').find('a[href="#'+currentSection+'"]').parent().addClass('active');
	$('select.small-menu option:selected').removeAttr('selected');
	$('select.small-menu option[value="#'+currentSection+'"]').attr('selected', 'selected');
});

jQuery(document).ready(function() {
	$("#main-menu").sticky({ topSpacing: 0 });
	$('#main-menu ul li a').click(function() {
		$('html, body').animate({scrollTop: $(this.hash).offset().top}, 800);
		return false;
	});
});