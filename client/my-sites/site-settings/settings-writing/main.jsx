/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import DocumentHead from 'calypso/components/data/document-head';
import JetpackDevModeNotice from 'calypso/my-sites/site-settings/jetpack-dev-mode-notice';
import Main from 'calypso/components/main';
import SidebarNavigation from 'calypso/my-sites/sidebar-navigation';
import FormattedHeader from 'calypso/components/formatted-header';
import SiteSettingsNavigation from 'calypso/my-sites/site-settings/navigation';
import WritingForm from 'calypso/my-sites/site-settings/form-writing';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import ScreenOptionsTab from 'calypso/components/screen-options-tab';

const SiteSettingsWriting = ( { site, translate } ) => (
	<Main className="settings-writing site-settings">
		<ScreenOptionsTab wpAdminPath="options-writing.php" />
		<DocumentHead title={ translate( 'Writing Settings' ) } />
		<JetpackDevModeNotice />
		<SidebarNavigation />
		<FormattedHeader
			brandFont
			className="settings-writing__page-heading"
			headerText={ translate( 'Writing Settings' ) }
			subHeaderText={ translate( "Manage settings related to your site's content." ) }
			align="left"
			hasScreenOptions
		/>
		<SiteSettingsNavigation site={ site } section="writing" />
		<WritingForm />
	</Main>
);

export default connect( ( state ) => ( {
	site: getSelectedSite( state ),
} ) )( localize( SiteSettingsWriting ) );
