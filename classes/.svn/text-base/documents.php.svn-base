<?php
namespace Habari;
class Documents extends Posts
{
	public static function get($paramarray = array()) {
		$defaults = array(
			'content_type' => 'document',
			'fetch_class' => 'Document',
		);
		
		$paramarray = array_merge($defaults, Utils::get_params($paramarray));
		return Posts::get( $paramarray );
	}
}

?>