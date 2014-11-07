var spu_count = 0;
var spu_counter ='';
var isMobile = function() {

        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
            return true;
        }
        else {
            return false;
        }
}
	function socialPopupTrafic(options) {
		var defaults = { days_no_click : "10" };
		var options = jQuery.extend(defaults, options);
		window.options = options;
		
		var cook = readCookie('spushow');
		var waitCook = readCookie('spuwait');

		if (cook != 'true') {
			var windowWidth = document.documentElement.clientWidth;
			var windowHeight = document.documentElement.clientHeight;
			var popupHeight = jQuery("#spu-main").height();
			var popupWidth = jQuery("#spu-main").width();
			jQuery("#spu-main").css({
				"position": "fixed",
				"top": (windowHeight / 2 - popupHeight / 2) - 100,
				"left": windowWidth / 2 - popupWidth / 2
			});
			jQuery("#spu-bg").css({
				"height": windowHeight + 30
			});
			jQuery("#spu-bg").css({
				"opacity": defaults.opacity
			});
			jQuery("#spu-bg").fadeIn("slow");
			jQuery("#spu-main").fadeIn("slow");
		}
		
		if (defaults.advancedClose == true) {
			jQuery(document).keyup(function(e) {
				if (e.keyCode == 27) {
					spuFlush(defaults.days_no_click);
				}
			});
			var ua = navigator.userAgent,
			event = (ua.match(/iPad/i) || ua.match(/iPhone/i)) ? "touchstart" : "click";
			
			jQuery('body').on(event, function (ev) {
				
				spuFlush(defaults.days_no_click);
			});
			jQuery('#spu-main').click(function(event) {
				event.stopPropagation();
			});
		}
		if( parseInt(defaults.s_to_close) > 0 )
		{
			spu_count=defaults.s_to_close;
			spu_counter = setInterval(function(){spu_timer(defaults)}, 1000);
		}
		return true;
	}

function thanks_msg(options){

	if( options.thanks_msg){
		//I add some delay because twitter is not completing follow event
		setTimeout(function(){
			jQuery('#spu-msg-cont').hide().html(options.thanks_msg).fadeIn();
		}, 500);
	}
	setTimeout(function(){ spuFlush()}, 1000 * options.thanks_sec);
}


jQuery(document).ready(function(){
FB.Event.subscribe('edge.create', function(href) {
	clearInterval(spu_counter);
	thanks_msg(window.options);
});
if (typeof twttr !== 'undefined') {
	twttr.ready(function(twttr) {
		clearInterval(spu_counter);
		twttr.events.bind('tweet', twitterCB);
		twttr.events.bind('follow', twitterCB);
	});
}
});
function twitterCB(intent_event) {
	thanks_msg(window.options);
	console.log(new Date(), "Sweett, tweet callback: ", intent_event);
	//alert( jQuery("#hd_msg_thanks").val() );
}

function googleCB(a) {
	clearInterval(spu_counter);
	if( "on" == a.state )
	{
	 	setTimeout(function(){thanks_msg(window.options)},2500);
	}

}
function closeGoogle(a){
	if( "confirm" == a.type )
	{
	setTimeout(function(){thanks_msg(window.options)},2500);
	}
}

function spuFlush( days ) {
	days = typeof days !== 'undefined' ? days : 99;
	createCookie('spushow', 'true', days);
	
	jQuery("#spu-bg").fadeOut("slow");
	jQuery("#spu-main").fadeOut("slow");
}

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
function spu_timer(defaults)
{
  spu_count=spu_count-1;
  if (spu_count <= 0)
  {
     clearInterval(spu_counter);
     spuFlush(defaults.days_no_click);
     return;
  }

 jQuery("#spu-timer").html(defaults.esperar+" "+spu_count + " " + defaults.segundos);
}
function in_array(needle, haystack) {
    for(var i in haystack) {
        if(haystack[i] == needle) return true;
    }
    return false;
}


jQuery(document).ready(function($){

	if( isMobile() && ! wp_popup_cache_var.enabled_mobiles ) return;

	var lets_popup = false;
	if( wp_popup_cache_var.type_page_current == 'everywhere' ){
		lets_popup = true;
	}else if( wp_popup_cache_var.type_page_current == 'post' ){
		if( !in_array( 'post',wp_popup_cache_var.show_in ) ){
			lets_popup = false;
		}else{
			lets_popup = true;
		}
	}else if( wp_popup_cache_var.type_page_current == 'page' ){
		if( !in_array( 'page',wp_popup_cache_var.show_in ) ){
			lets_popup = false;
		}else{
			lets_popup = true;
		}	
	}else if( wp_popup_cache_var.type_page_current == 'home' ){
		if( !in_array( 'home',wp_popup_cache_var.show_in ) ){
			lets_popup = false;
		}else{
			lets_popup = true;
		}
	}

	if( wp_popup_cache_var.enable && lets_popup ){

		setTimeout( 
			function(){				
				
				var html_pure = "";
				var html_youtube = "";
				var html_google = "";
				var html_twitter="";
				var html_facebook="";

				var date_current = new Date();
				var day = date_current.getDay();

				// google days url
				var button_google = [];
				button_google[1] = wp_popup_cache_var.google_url_default;
				button_google[2] = wp_popup_cache_var.google_url_tuesday;
				button_google[3] = wp_popup_cache_var.google_url_wednesday;
				button_google[4] = wp_popup_cache_var.google_url_thursday;
				button_google[5] = wp_popup_cache_var.google_url_friday;
				button_google[6] = wp_popup_cache_var.google_url_saturday;
				button_google[0] = wp_popup_cache_var.google_url_sunday;

				// twitter days url
				var button_twitter = [];
				button_twitter[1] = wp_popup_cache_var.twitter_url_default;
				button_twitter[2] = wp_popup_cache_var.twitter_url_tuesday;
				button_twitter[3] = wp_popup_cache_var.twitter_url_wednesday;
				button_twitter[4] = wp_popup_cache_var.twitter_url_thursday;
				button_twitter[5] = wp_popup_cache_var.twitter_url_friday;
				button_twitter[6] = wp_popup_cache_var.twitter_url_saturday;
				button_twitter[0] = wp_popup_cache_var.twitter_url_sunday;

				// facebook days url
				var button_facebook = [];
				button_facebook[1] = wp_popup_cache_var.facebook_url_default;
				button_facebook[2] = wp_popup_cache_var.facebook_url_tuesday;
				button_facebook[3] = wp_popup_cache_var.facebook_url_wednesday;
				button_facebook[4] = wp_popup_cache_var.facebook_url_thursday;
				button_facebook[5] = wp_popup_cache_var.facebook_url_friday;
				button_facebook[6] = wp_popup_cache_var.facebook_url_saturday;
				button_facebook[0] = wp_popup_cache_var.facebook_url_sunday;


				if( wp_popup_cache_var.button_youtube_suscribe ){

					html_youtube = '<div class="g-ytsubscribe" data-channel="'+wp_popup_cache_var.button_youtube_suscribe+'" data-layout="full" data-count="undefined"></div>';

				}

				if( wp_popup_cache_var.button_go ){
					if( wp_popup_cache_var.type_button_gplus == 'button' ){
						type_button_google = "g-plusone";
					}else{
						type_button_google = "g-plus";
					}

					if( !button_google[day] ){
						if( button_google[1] ){
							html_google = '<div class="spu-button spu-google"><div class="'+type_button_google+'" data-callback="googleCB" data-onendinteraction="closeGoogle" data-recommendations="false" data-annotation="bubble" data-size="medium" data-href="'+button_google[1]+'" width="300" height="69"></div></div>';
						}
					}else{
						html_google = '<div class="spu-button spu-google"><div class="'+type_button_google+'" data-callback="googleCB" data-onendinteraction="closeGoogle" data-recommendations="false" data-annotation="bubble" data-size="medium" data-href="'+button_google[day]+'" width="300" height="69"></div></div>';
					}
				}


				if( wp_popup_cache_var.button_tw ){

					if( !button_twitter[day] ){
						if( button_twitter[1] ){
							html_twitter = '<div class="spu-button spu-twitter"><a href="https://twitter.com/'+button_twitter[1]+'" class="twitter-follow-button" data-show-count="false" >Follow Me</a></div>';
						}
					}else{
						html_twitter = '<div class="spu-button spu-twitter"><a href="https://twitter.com/'+button_twitter[day]+'" class="twitter-follow-button" data-show-count="false" >Follow Me</a></div>';
					}
				}


				if( wp_popup_cache_var.button_fb ){
 
					if( !button_facebook[day] ){
						if( button_facebook[1] ){
							html_facebook = '<div class="spu-button spu-facebook"><div id="fb-root"></div><div class="fb-like" data-href="' +button_facebook[1]+ '" data-send="false" data-width="450" data-show-faces="true"data-layout="button_count"></div></div>';
						}
					}else{
						html_facebook = '<div class="spu-button spu-facebook"><div id="fb-root"></div><div class="fb-like" data-href="' +button_facebook[day]+ '" data-send="false" data-width="450" data-show-faces="true"data-layout="button_count"></div></div>';
					}
				}




				html_pure +='<div id="spu-bg"></div>';
				html_pure +='<div id="spu-main">';
				if( wp_popup_cache_var.show_close_button ){
					html_pure += '<a href="#" onClick="spuFlush('+wp_popup_cache_var.until_popup+');" id="spu-close">✕</a>';					
				}

				html_pure +='<div id="spu-body">';
				html_pure +='<div id="spu-title">'+wp_popup_cache_var.title_message+'</div>';
					html_pure +='<div id="spu-msg-cont">';
						html_pure +='<div id="spu-msg">';
						html_pure +=wp_popup_cache_var.content_message;
						html_pure +='<br /><br />';
						html_pure +=html_youtube+' '+html_twitter+' '+html_facebook+' '+html_google;
						html_pure +='</div>';
						html_pure +='<div class="step-clear"></div>';
					html_pure +='</div>';
					html_pure +='<span id="spu-timer"></span>';
				html_pure +='</div>';

				html_pure +='</div>';
				html_pure +="<input type='hidden' name='hd_msg_thanks' id='hd_msg_thanks' value='"+wp_popup_cache_var.thanks_message+"' />";
				html_pure +="<style>#spu-bg{background:#fff}#spu-main{border:"+wp_popup_cache_var.border_width+"px solid "+wp_popup_cache_var.border_bg+"!important;box-shadow:0px 0px 12px #6F6F6F;}</style>";

				$('#wp_social_popup_and_get_traffic').html(html_pure);

				socialPopupTrafic({
					// Configure display of popup
					advancedClose: (wp_popup_cache_var.closed_advanced_keys) ? true:false,
					opacity: wp_popup_cache_var.opacity,
					s_to_close: wp_popup_cache_var.seconds_close,
					days_no_click: wp_popup_cache_var.until_popup,
					segundos : 'seconds',
					esperar : 'Wait' ,
					thanks_msg : wp_popup_cache_var.thanks_message, 
					thanks_sec : wp_popup_cache_var.thanks_message_seconds
				});

				if( html_facebook ){
					FB.XFBML.parse();
				}
				//$('#wp_social_popup_and_get_traffic').find('a.twitter-share-button').each(function(){
				/*$('#wp_social_popup_and_get_traffic').find('a.twitter-follow-button').each(function(){
					
				    var tweet_button = new twttr.TweetButton( $( this ).get( 0 ) );
				    tweet_button.render();
				    alert("entro");
				});*/
				if( html_twitter ){
					twttr.widgets.load();
				}

				if( html_google || html_youtube ){
					 gapi.plusone.render('live-preview');
				}


			}
			,(parseInt(wp_popup_cache_var.seconds_appear)*1000)
		);
	}
});	