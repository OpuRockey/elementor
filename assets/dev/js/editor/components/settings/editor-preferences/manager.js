import BaseManager from '../base/manager';

export default class extends BaseManager {
	getDefaultSettings() {
		return {
			darkModeLinkID: 'elementor-editor-dark-mode-css',
		};
	}

	constructor( ...args ) {
		super( ...args );

		this.changeCallbacks = {
			ui_theme: this.onUIThemeChanged,
			edit_buttons: this.onEditButtonsChanged,
		};
	}

	createDarkModeStylesheetLink() {
		const darkModeLinkID = this.getSettings( 'darkModeLinkID' );

		let $darkModeLink = jQuery( '#' + darkModeLinkID );

		if ( ! $darkModeLink.length ) {
			$darkModeLink = jQuery( '<link>', {
				id: darkModeLinkID,
				rel: 'stylesheet',
				href: elementor.config.ui.darkModeStylesheetURL,
			} );
		}

		this.$link = $darkModeLink;
	}

	getDarkModeStylesheetLink() {
		if ( ! this.$link ) {
			this.createDarkModeStylesheetLink();
		}

		return this.$link;
	}

	onUIThemeChanged( newValue ) {
		const $link = this.getDarkModeStylesheetLink();

		if ( 'light' === newValue ) {
			$link.remove();

			return;
		}

		$link.attr( 'media', 'auto' === newValue ? '(prefers-color-scheme: dark)' : '' ).appendTo( elementorCommon.elements.$body );
	}

	onEditButtonsChanged() {
		// Let the button change before the high-performance action of rendering the entire page
		setTimeout( () => elementor.getPreviewView().render(), 300 );
	}
}
