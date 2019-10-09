import ElementIcon from '../images/logo.svg';

const { __ } = window.wp.i18n;
const { registerFormatType, unregisterFormatType } = window.wp.richText;
const { RichTextToolbarButton } = window.wp.blockEditor;

unregisterFormatType( 'nelio/button' );
registerFormatType( 'nelio/button', {
	title: __( 'Nelio', 'nelio' ),
	tagName: 'span',
	className: 'nelio',
	edit: ( { value, onChange } ) => (
		<RichTextToolbarButton
			icon={ <ElementIcon /> }
			title={ __( 'Nelio', 'nelio' ) }
			onClick={ () => onChange( doTheJob( value ) ) }
		/>
	),
} );

function doTheJob( value ) {

	const selectedText = value.text.substring( value.start, value.end );
	if ( 0 === selectedText.length ) {
		return;
	}//end if

	// Do things with the selected text here...
	console.log( selectedText );

}//end openDialogToCreateAMessage()
