import ElementIcon from '../images/logo.svg';

const { Fragment } = wp.element;
const { __ } = window.wp.i18n;
const { registerFormatType, unregisterFormatType } = window.wp.richText;
const { RichTextToolbarButton } = window.wp.editor;


unregisterFormatType( 'nelio/button' );
registerFormatType( 'nelio/button', {
	title: __( 'Nelio', 'nelio-content' ),
	tagName: 'span',
	className: null,
	edit({ value }) {
		const onClick = () => doTheJob( value );

		return (
			<Fragment>
				<RichTextToolbarButton
					icon={ <ElementIcon /> }
					title={ __( 'Nelio', 'nelio-content' ) }
					onClick={ onClick }
				/>
			</Fragment>
		);
	}
});

function doTheJob( value ) {

	let selectedText = value.text.substring( value.start, value.end );
	if ( 0 === selectedText.length ) {
		return;
    }//end if

    // Do things with the selected text here...
    console.log( selectedText );

}//end openDialogToCreateAMessage()
