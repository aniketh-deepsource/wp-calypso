/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import DiscussionForm from 'calypso/my-sites/site-settings/form-discussion';
import DocumentHead from 'calypso/components/data/document-head';
import JetpackDevModeNotice from 'calypso/my-sites/site-settings/jetpack-dev-mode-notice';
import Main from 'calypso/components/main';
import SidebarNavigation from 'calypso/my-sites/sidebar-navigation';
import FormattedHeader from 'calypso/components/formatted-header';
import SiteSettingsNavigation from 'calypso/my-sites/site-settings/navigation';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import ScreenOptionsTab from 'calypso/components/screen-options-tab';

const SiteSettingsDiscussion = ( { site, translate } ) => (
	<Main className="settings-discussion site-settings">
		<ScreenOptionsTab wpAdminPath="options-discussion.php" />
		<DocumentHead title={ translate( 'Discussion Settings' ) } />
		<JetpackDevModeNotice />
		<SidebarNavigation />
		<FormattedHeader
			brandFont
			className="settings-discussion__page-heading"
			headerText={ translate( 'Discussion Settings' ) }
			subHeaderText={ translate( 'Control how people interact with your site through comments.' ) }
			align="left"
			hasScreenOptions
		/>
		<SiteSettingsNavigation site={ site } section="discussion" />
		<DiscussionForm />
	</Main>
);

export default connect( ( state ) => ( {
	site: getSelectedSite( state ),
} ) )( localize( SiteSettingsDiscussion ) );
