$(document).ready(function() {
	styleCode();
	
	$(".save").on('click', function() {
		if( $('.editable').attr('contenteditable') == 'true' ) {
			var content = $('.editable').html();
			var title = $('h2.title').html();
			var data = $('#update_doc').serializeArray();
			var obj = new Object();
			obj.content = content;
			obj.title = title;
			
			var url = $('.inplace').attr('action');
			$.post( url, obj, handleResponse  );

			styleCode();
			
			$('h2.title').attr( 'contenteditable', false );
			$('.editable').attr( 'contenteditable', false );
			
			return false;
		} else {
			$('.inplace').load( HPO.page + ' #content', function() {
				loaded = false;
				$('h2.title').attr( 'contenteditable', true );
				$('.editable').redactor({ air: true, airButtons: ['formatting', '|', 'indent', 'outdent', 'horizontalrule', 'orderedlist', 'unorderedlist', 'blockquote', 'bold', 'italic', 'deleted', 'link', '|', 'video'] });
			});

			return false;
		}
	});
});

var handleResponse = function(data, callback) {
	if(data.response_code == undefined) {
	} else {
		if(data.response_code != 200) {
			// @todo Do something different on error?
		}
				
		if(data.message != undefined && data.message != '') {
			displayMessage( data.message );
		}
		
		if(data.habari_callback != undefined) {
			eval(data.habari_callback);
		}
		
		var semaphore = 0;
		var all = false;
		
		for(var i in data.html) {
			var value = data.html[i];
			if(value == '#') {
				semaphore++
				$(i).hide().load(location.href + ' #' + $(i).attr('id') + ' > *', function() {
					semaphore--;
				}).fadeIn();
			}
			else {
				$(i).html(value);
			}
		}
	}
	
	all = true;
}

var styleCode = function() {
	var a = false;

	$('pre').each(function() {
		if (!$(this).hasClass("prettyprint")) {
			$(this).addClass("prettyprint");
			a = true
		}
	});
	
	if(a) { prettyPrint() }
}

var displayMessage = function(message) {
	human_msg.display_msg( message );
}

/*
 * HUMANIZED MESSAGES, v2
 * idea - http://www.humanized.com/weblog/2006/09/11/monolog_boxes_and_transparent_messages
 * original code by Michael Heilemann - http://humanmsg.googlecode.com
 * 
 * adapted and modified for Habari and updated for newer versions of jQuery
 */

var human_msg = {
	
	msg_id: 'humanMsg',			// the base string of the ID for the displayed 'growl' message
	log_id: 'humanMsgLog',		// the base string of the ID for the drawer message
	
	append_to: 'body',			// the element the msg is appended to
	log_name: 'Message Log',	// the text on the log tab
	msg_opacity: '0.8',			// the opacity of the displayed 'growl' messages
	
	message_count: 0,			// incrementor for creating sequential IDs
	
	init: function ( append_to, log_name, msg_opacity ) {
		
		// append_to is the element the msg is appended to
		if ( append_to != undefined ) {
			human_msg.append_to = append_to;
		}
		
		// the text on the log tab
		if ( log_name != undefined ) {
			human_msg.log_name = log_name;
		}
		
		// opacity of the messages
		if ( msg_opacity != undefined ) {
			human_msg.msg_opacity = parseFloat( msg_opacity );
		}
		
		// inject the message structure
		jQuery(human_msg.append_to).append(
				'<div id="' + human_msg.msg_id + '" class="humanMsg">' +
					'<div class="imsgs"></div>' +
				'</div>' +
				'<div id="' + human_msg.log_id + '">' +
					'<p>' + human_msg.log_name + '</p>' +
					'<ul></ul>' +
				'</div>'
		);
		
		// bind the events to show the log pane
		jQuery('#' + human_msg.log_id + ' p').click( function() {
			if ( jQuery('#' + human_msg.log_id).hasClass('logisopen') ) {
				// only remove the class once the animation has finished to ensure smooth consistent behaviour when closing
				jQuery('ul', '#' + human_msg.log_id).slideToggle('400', function() { jQuery('#' + human_msg.log_id).toggleClass('logisopen'); });
			} else {
				jQuery('ul', '#' + human_msg.log_id).slideToggle();
				jQuery('#' + human_msg.log_id).toggleClass('logisopen');
			}
		} );
		
		// bind the events to hide the log pane
		jQuery('#' + human_msg.log_id + ' ul').click( function() {
			if ( jQuery('#' + human_msg.log_id).hasClass('logisopen') ) {
				// only remove the class once the animation has finished to ensure smooth consistent behaviour when closing
				jQuery(this).slideToggle('400', function() { jQuery('#' + human_msg.log_id).toggleClass('logisopen'); });
			} else {
				jQuery(this).slideToggle();
				jQuery('#' + human_msg.log_id).toggleClass('logisopen');
			}
		} );
		
	},
	
	display_msg: function ( msg ) {
		
		// ignore blank messages
		if ( msg == '' ) {
			return;
		}
		
		// increment the counter
		human_msg.message_count++;
		
		// now we inject the message
		
		// show the container for messages
		jQuery('#' + human_msg.msg_id).show();
		
		// create the message we'll show
		var message = jQuery('<div class="msg" id="msgid_' + human_msg.message_count + '"><p>' + msg + '</p></div>');
		
		jQuery(message)
			.appendTo('#' + human_msg.msg_id + ' .imsgs')	// append the message to the container
			.show()		// show the new displayed message
			.fadeTo( 500, human_msg.msg_opacity, function() {} );
		
		// bind the click event to immediately hide a message
		jQuery(message).click( function() {
			human_msg.remove_msg( this );
		} );
		
		// and set the timer to remove this message in 5 seconds
		setTimeout( function() {
			human_msg.remove_msg( message );
		}, 5000 );
		
	},
	
	remove_msg: function ( msg ) {
		
		// fade out the message
		jQuery( msg ).fadeTo( 500, 0, function() {
			// when it's faded out, remove it entirely from the DOM
			jQuery(this).remove();
		} );
		
	}
		
}

jQuery(document).ready( function() {
	// broken out into a function so you can add default parameters
	human_msg.init('body', 'Message Log', 0.8);
} );