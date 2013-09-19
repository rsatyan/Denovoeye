/* ===================================================
 * bounce.js v2.1
 * ========================================================== */
 
$(document).ready(function(){

    /* Animated Skills Bar
    * ====================== */  
	$('.progress-skills').each(function(){
		var t = $(this),
		label = t.attr('data-label');
        percent = t.attr('data-percent') + '%';
        t.find('.bar').text(label + ' ' + '(' + percent + ')').animate({width:percent});
      });

    /* Fluid Resposive Video Embeds
	 * https://github.com/davatron5000/FitVids.js
    * ====================== */   	
	$(".js-video").fitVids();

    /* Input Validation
	 * https://github.com/ReactiveRaven/jqBootstrapValidation
    * ====================== */  	
	$("input").not("[type=submit]").jqBootstrapValidation();
	
    /* Scroll Effect for Alt. Homepage
	* ====================== */	 
	function scrollEffect() {
		scrollPos = $(this).scrollTop();
        $('#landingSlide').css({'background-position': 'center ' + (200 + (scrollPos/4)) + "px"});
    }
    $(window).scroll(function() {
		scrollEffect();
    }); 	

    /* Smooth Scroll to Top
    * ====================== */
	$("#totop").click(function () {
		$("html, body").animate({
			scrollTop: 0
	    }, 300);
		return false;
	});	


	$("#contact-submit").on('click',function() {		
		$contact_form = $('#contact-form');		
		var fields = $contact_form.serialize();				
		$.ajax({
			type: "POST",
			url: "contact.php",
			data: fields,	
			
			success: function(response) {				
				$('#contact-form input').val('');
				$('#contact-form textarea').val('');
				$('#response').empty().html("<b>"+response+"</b>");
				$('#response').show();
			}
		});
		return false;
	});

	$("#ticker").tweet({
          username: "denovonow",
          page: 1,
          avatar_size: 0,
          count: 20,
          loading_text: "loading ...",
          template: "{text}{time}"
        }).bind("loaded", function() {
          var ul = $(this).find(".tweet_list");
          var ticker = function() {
            setTimeout(function() {
              var top = ul.position().top;
              var h = ul.height();
              var incr = (h / ul.children().length);
              var newTop = top - incr;
              if (h + newTop <= 0) newTop = 0;
              ul.animate( {top: newTop}, 500 );
              ticker();
            }, 5000);
          };
          ticker();
        })



});