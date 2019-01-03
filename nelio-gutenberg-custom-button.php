<?php
/**
 * The plugin bootstrap file.
 *
 * Plugin Name: Nelio Gutenberg Custom Button
 * Plugin URI:  https://neliosoftware.com/
 * Description: Add custom button to Rich Text blocks in Gutenberg for WordPress.
 * Version:     1.0.0
 *
 * Author:      Nelio Software
 * Author URI:  https://neliosoftware.com
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * Text Domain: nelio
 * Domain Path: /languages
 *
 * @package    Nelio
 * @author     Antonio Villegas <antonio.villegas@neliosoftware.com>
 * @since      1.0.0
 */

! defined( 'ABSPATH' ) && exit;

class NelioButton {

	private static $_instance = null;

	public $plugin_path;
	public $plugin_url;
	public $plugin_name;
	public $plugin_version;

	public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
            self::$_instance->init_options();
            self::$_instance->init_hooks();
        }
        return self::$_instance;
	}

	public function init_options() {

        $this->plugin_path = plugin_dir_path( __FILE__ );
        $this->plugin_url = plugin_dir_url( __FILE__ );

		// load textdomain.
		load_plugin_textdomain( 'nelio', false, basename( dirname( __FILE__ ) ) . '/languages' );

	}

	public function init_hooks() {

        add_action( 'admin_init', array( $this, 'admin_init' ) );

        // include blocks.
        // work only if Gutenberg available.
        if ( function_exists( 'register_block_type' ) ) {

			// we need to enqueue the main script earlier to let 3rd-party plugins add custom styles support.
            add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ), 9 );

		}//end if

	}

	public function enqueue_block_editor_assets() {

		wp_enqueue_script(
			'nelio-blocks-gutenberg',
			untrailingslashit( plugin_dir_url( __FILE__ ) ) . '/dist/js/gutenberg.js',
			[ 'wp-editor', 'wp-i18n', 'wp-element', 'wp-compose', 'wp-components' ],
			'1.0.0',
			true
		);

		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'nelio-gutenberg', 'nelio' );
		}//end if

	}

	public function admin_init() {

        // get current plugin data.
        $data = get_plugin_data( __FILE__ );
        $this->plugin_name = $data['Name'];
        $this->plugin_version = $data['Version'];
        $this->plugin_slug = plugin_basename( __FILE__, '.php' );
		$this->plugin_name_sanitized = basename( __FILE__, '.php' );

    }

}

function nelio_button() {
    return NelioButton::instance();
}
add_action( 'plugins_loaded', 'nelio_button' );
