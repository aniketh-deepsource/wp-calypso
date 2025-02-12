/**
 * External dependencies
 */

import React from 'react';
import { pickBy } from 'lodash';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Main from 'calypso/components/main';
import CurrentTheme from 'calypso/my-sites/themes/current-theme';
import SidebarNavigation from 'calypso/my-sites/sidebar-navigation';
import { isPartnerPurchase } from 'calypso/lib/purchases';
import { connectOptions } from './theme-options';
import UpsellNudge from 'calypso/blocks/upsell-nudge';
import {
	FEATURE_UNLIMITED_PREMIUM_THEMES,
	PLAN_JETPACK_SECURITY_REALTIME,
} from '@automattic/calypso-products';
import ThemeShowcase from './theme-showcase';
import ThemesSelection from './themes-selection';
import { addTracking } from './helpers';
import {
	getCurrentPlan,
	hasFeature,
	isRequestingSitePlans,
} from 'calypso/state/sites/plans/selectors';
import { getByPurchaseId } from 'calypso/state/purchases/selectors';
import { getLastThemeQuery, getThemesFoundForQuery } from 'calypso/state/themes/selectors';
import { getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import { isJetpackSiteMultiSite } from 'calypso/state/sites/selectors';
import ThemesHeader from './themes-header';

const ConnectedThemesSelection = connectOptions( ( props ) => {
	return (
		<ThemesSelection
			{ ...props }
			getOptions={ function ( theme ) {
				return pickBy(
					addTracking( props.options ),
					( option ) => ! ( option.hideForTheme && option.hideForTheme( theme, props.siteId ) )
				);
			} }
		/>
	);
} );

const ConnectedSingleSiteJetpack = connectOptions( ( props ) => {
	const {
		currentPlan,
		emptyContent,
		filter,
		getScreenshotOption,
		purchase,
		showWpcomThemesList,
		search,
		siteId,
		vertical,
		tier,
		translate,
		hasUnlimitedPremiumThemes,
		requestingSitePlans,
		siteSlug,
	} = props;

	const isPartnerPlan = purchase && isPartnerPurchase( purchase );

	return (
		<Main fullWidthLayout className="themes">
			<SidebarNavigation />
			<ThemesHeader />
			<CurrentTheme siteId={ siteId } />
			{ ! requestingSitePlans && currentPlan && ! hasUnlimitedPremiumThemes && ! isPartnerPlan && (
				<UpsellNudge
					forceDisplay
					title={ translate( 'Get unlimited premium themes' ) }
					description={ translate(
						'In addition to our collection of premium themes, get comprehensive WordPress' +
							' security, real-time backups, and unlimited video hosting.'
					) }
					event="themes_plans_free_personal_premium"
					showIcon={ true }
					href={ `/checkout/${ siteSlug }/${ PLAN_JETPACK_SECURITY_REALTIME }` }
				/>
			) }
			<ThemeShowcase
				{ ...props }
				siteId={ siteId }
				emptyContent={ showWpcomThemesList ? <div /> : null }
				isJetpackSite={ true }
			>
				{ showWpcomThemesList && (
					<div>
						<ConnectedThemesSelection
							origin="wpcom"
							defaultOption={ 'activate' }
							secondaryOption={ 'tryandcustomize' }
							search={ search }
							tier={ tier }
							filter={ filter }
							vertical={ vertical }
							siteId={ siteId /* This is for the options in the '...' menu only */ }
							getScreenshotUrl={ function ( theme ) {
								if ( ! getScreenshotOption( theme ).getUrl ) {
									return null;
								}
								return getScreenshotOption( theme ).getUrl( theme );
							} }
							onScreenshotClick={ function ( themeId ) {
								if ( ! getScreenshotOption( themeId ).action ) {
									return;
								}
								getScreenshotOption( themeId ).action( themeId );
							} }
							getActionLabel={ function ( theme ) {
								return getScreenshotOption( theme ).label;
							} }
							trackScrollPage={ props.trackScrollPage }
							source="wpcom"
							emptyContent={ emptyContent }
						/>
					</div>
				) }
			</ThemeShowcase>
		</Main>
	);
} );

export default connect( ( state, { siteId, tier } ) => {
	const siteSlug = getSelectedSiteSlug( state );
	const currentPlan = getCurrentPlan( state, siteId );
	const isMultisite = isJetpackSiteMultiSite( state, siteId );
	const showWpcomThemesList = ! isMultisite;
	let emptyContent = null;
	if ( showWpcomThemesList ) {
		const siteQuery = getLastThemeQuery( state, siteId );
		const wpcomQuery = getLastThemeQuery( state, 'wpcom' );
		const siteThemesCount = getThemesFoundForQuery( state, siteId, siteQuery );
		const wpcomThemesCount = getThemesFoundForQuery( state, 'wpcom', wpcomQuery );
		emptyContent = ! siteThemesCount && ! wpcomThemesCount ? null : <div />;
	}
	return {
		currentPlan,
		purchase: currentPlan ? getByPurchaseId( state, currentPlan.id ) : null,
		tier,
		showWpcomThemesList,
		emptyContent,
		isMultisite,
		hasUnlimitedPremiumThemes: hasFeature( state, siteId, FEATURE_UNLIMITED_PREMIUM_THEMES ),
		requestingSitePlans: isRequestingSitePlans( state, siteId ),
		siteSlug,
	};
} )( ConnectedSingleSiteJetpack );
