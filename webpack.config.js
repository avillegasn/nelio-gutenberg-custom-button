const path = require( 'path' );
const webpack = require( 'webpack' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );
const wpPot = require( 'wp-pot' );

const inProduction = ( 'production' === process.env.NODE_ENV );

const config = {

	// Ensure modules like magnific know jQuery is external (loaded via WP).
	externals: {
		$: 'jQuery',
		jquery: 'jQuery',
		lodash: 'lodash',
		react: 'React',
	},
	devtool: 'source-map',
	module: {
		rules: [

			// Use Babel to compile JS.
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: [
					'babel-loader',
				],
			},

			// Create RTL styles.
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract( 'style-loader' ),
			},

			// SASS to CSS.
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract( {
					use: [ {
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					}, {
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
						},
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							outputStyle: ( inProduction ? 'compressed' : 'nested' ),
						},
					} ],
				} ),
			},

			// Image files.
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]',
							publicPath: '../',
						},
					},
				],
			},

			// SVG files.
			{
				test: /.svg$/,
				use: [
					{
						loader: 'svg-react-loader',
					},
				],
			},
		],
	},

	// Plugins. Gotta have em'.
	plugins: [

		// Removes the "dist" folder before building.
		new CleanWebpackPlugin( [ 'dist' ] ),

		new ExtractTextPlugin( 'css/[name].css' ),

		// Create RTL css.
		new WebpackRTLPlugin(),

		// Copy images and SVGs
		new CopyWebpackPlugin( [ { from: 'src/images', to: 'images' } ] ),

		// Copy index.php to all dist directories.
		new CopyWebpackPlugin( [ { from: 'index.php', to: '.' } ] ),

		// Minify images.
		// Must go after CopyWebpackPlugin above: https://github.com/Klathmon/imagemin-webpack-plugin#example-usage
		new ImageminPlugin( { test: /\.(jpe?g|png|gif|svg)$/i } ),

	],
};

module.exports = [

	Object.assign( {
		entry: {
			gutenberg: [ './src/js/gutenberg.js' ],
		},
		output: {
			path: path.join( __dirname, './dist/' ),
			filename: 'js/[name].js',
			library: 'NelioBlocks',
			libraryTarget: 'umd',
		},
	}, config ),

];

// inProd?
if ( inProduction ) {
	// POT file.
	wpPot( {
		package: 'Nelio',
		domain: 'nelio',
		destFile: 'languages/nelio.pot',
		relativeTo: './',
		team: 'Nelio Software <info@neliosoftware.com>',
	} );

	// Uglify JS.
	config.plugins.push( new webpack.optimize.UglifyJsPlugin( { sourceMap: true } ) );

	// Minify CSS.
	config.plugins.push( new webpack.LoaderOptionsPlugin( { minimize: true } ) );

}
