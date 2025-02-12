import { localize } from 'i18n-calypso';
import { find, get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import titlecase from 'to-title-case';
import ExtensionRedirect from 'calypso/blocks/extension-redirect';
import Main from 'calypso/components/main';
import Notice from 'calypso/components/notice';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import { getSiteSlug } from 'calypso/state/sites/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import AdvancedTab from '../components/advanced';
import CdnTab from '../components/cdn';
import ContentsTab from '../components/contents';
import QueryStatus from '../components/data/query-status';
import DebugTab from '../components/debug';
import EasyTab from '../components/easy';
import Navigation from '../components/navigation';
import PluginsTab from '../components/plugins';
import PreloadTab from '../components/preload';
import { getStatus } from '../state/status/selectors';
import { Tabs, WPSC_MIN_VERSION } from './constants';

class WPSuperCache extends Component {
	static propTypes = {
		status: PropTypes.object.isRequired,
		siteId: PropTypes.number,
		tab: PropTypes.string,
	};

	static defaultProps = {
		tab: '',
	};

	renderTab( isReadOnly ) {
		const { tab } = this.props;

		switch ( tab ) {
			case Tabs.ADVANCED.slug:
				return <AdvancedTab isReadOnly={ isReadOnly } />;
			case Tabs.CDN.slug:
				return <CdnTab />;
			case Tabs.CONTENTS.slug:
				return <ContentsTab isReadOnly={ isReadOnly } />;
			case Tabs.PRELOAD.slug:
				return <PreloadTab />;
			case Tabs.PLUGINS.slug:
				return <PluginsTab />;
			case Tabs.DEBUG.slug:
				return <DebugTab />;
			default:
				return <EasyTab isReadOnly={ isReadOnly } />;
		}
	}

	render() {
		const {
			siteId,
			siteSlug,
			status: { cache_disabled: cacheDisabled },
			tab,
			translate,
		} = this.props;
		const mainClassName = 'wp-super-cache__main';

		const currentTab = find( Tabs, ( t ) => t.slug === tab );
		// Required minimum version for the extension is WPSC_MIN_VERSION, but some tabs require later versions.
		const minVersion = get( currentTab, 'minVersion', WPSC_MIN_VERSION );

		let redirectUrl = '';
		if ( minVersion !== WPSC_MIN_VERSION ) {
			// We have a tab specific minimum version. If that version isn't fulfilled, we want to redirect
			// to the 'default' tab (instead of the plugin installation page).
			redirectUrl = '/extensions/wp-super-cache/' + siteSlug;
		}

		return (
			<Main className={ mainClassName }>
				<ExtensionRedirect
					pluginId="wp-super-cache"
					minimumVersion={ minVersion }
					siteId={ siteId }
					redirectUrl={ redirectUrl }
				/>
				<QueryStatus siteId={ siteId } />
				<PageViewTracker
					path={ `/extensions/wp-super-cache/${ tab ? tab + '/' : '' }:site` }
					title={ `WP Super Cache > ${ tab ? titlecase( tab ) : 'Easy' }` }
				/>

				{ cacheDisabled && (
					<Notice
						showDismiss={ false }
						status="is-error"
						text={ translate( 'Read Only Mode. Configuration cannot be changed.' ) }
					/>
				) }

				<Navigation activeTab={ tab } siteId={ siteId } />
				{ this.renderTab( !! cacheDisabled ) }
			</Main>
		);
	}
}

const connectComponent = connect( ( state ) => {
	const siteId = getSelectedSiteId( state );
	const siteSlug = getSiteSlug( state, siteId );

	return {
		status: getStatus( state, siteId ),
		siteId,
		siteSlug,
	};
} );

export default connectComponent( localize( WPSuperCache ) );
