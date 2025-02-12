/**
 * External dependencies
 */
import React from 'react';
import { useSelector } from 'react-redux';
import page from 'page';
import classNames from 'classnames';
import { useTranslate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { isEnabled } from '@automattic/calypso-config';
import { useLocalizedMoment } from 'calypso/components/localized-moment';
import useDateWithOffset from 'calypso/lib/jetpack/hooks/use-date-with-offset';
import isJetpackCloud from 'calypso/lib/jetpack/is-jetpack-cloud';
import { INDEX_FORMAT } from 'calypso/lib/jetpack/backup-utils';
import {
	getForCurrentCROIteration,
	Iterations,
} from 'calypso/my-sites/plans/jetpack-plans/iterations';
import getActivityLogFilter from 'calypso/state/selectors/get-activity-log-filter';
import getDoesRewindNeedCredentials from 'calypso/state/selectors/get-does-rewind-need-credentials';
import getRewindCapabilities from 'calypso/state/selectors/get-rewind-capabilities';
import getSettingsUrl from 'calypso/state/selectors/get-settings-url';
import { getSelectedSiteId, getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import DocumentHead from 'calypso/components/data/document-head';
import QueryRewindCapabilities from 'calypso/components/data/query-rewind-capabilities';
import QueryRewindState from 'calypso/components/data/query-rewind-state';
import TimeMismatchWarning from 'calypso/blocks/time-mismatch-warning';
import BackupPlaceholder from 'calypso/components/jetpack/backup-placeholder';
import FormattedHeader from 'calypso/components/formatted-header';
import Main from 'calypso/components/main';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import SidebarNavigation from 'calypso/components/sidebar-navigation';
import { BackupStorageSpace } from 'calypso/components/backup-storage-space';
import { backupMainPath } from './paths';
import BackupDatePicker from './backup-date-picker';
import EnableRestoresBanner from './enable-restores-banner';
import SearchResults from './search-results';
import { DailyStatus, RealtimeStatus } from './status';
import {
	DailyStatus as DailyStatusSimplifiedI4,
	RealtimeStatus as RealtimeStatusSimplifiedI4,
} from './status/simplified-i4';

/**
 * Style dependencies
 */
import './style.scss';

const BackupPage = ( { queryDate } ) => {
	const siteId = useSelector( getSelectedSiteId );
	const siteSettingsUrl = useSelector( ( state ) => getSettingsUrl( state, siteId, 'general' ) );

	const moment = useLocalizedMoment();
	const parsedQueryDate = queryDate ? moment( queryDate, INDEX_FORMAT ) : moment();

	// If a date is specified, it'll be in a timezone-agnostic string format,
	// so we'll need to add the site's TZ info in without affecting the date
	// we were given.
	//
	// Otherwise, if no date is specified, we're talking about the current date.
	// This is the same point in time for everyone, but we should make sure to
	// store it in terms of the selected site's time zone.
	const selectedDate = useDateWithOffset( parsedQueryDate, {
		keepLocalTime: !! queryDate,
	} );

	return (
		<div
			className={ classNames( 'backup__page', {
				wordpressdotcom: ! isJetpackCloud(),
			} ) }
		>
			<Main
				className={ classNames( {
					is_jetpackcom: isJetpackCloud(),
				} ) }
			>
				<SidebarNavigation />
				<TimeMismatchWarning siteId={ siteId } settingsUrl={ siteSettingsUrl } />
				{ ! isJetpackCloud() && (
					<FormattedHeader headerText="Jetpack Backup" align="left" brandFont />
				) }

				<AdminContent selectedDate={ selectedDate } />
			</Main>
		</div>
	);
};

const isFilterEmpty = ( filter ) => {
	if ( ! filter ) {
		return true;
	}

	if ( filter.group || filter.on || filter.before || filter.after ) {
		return false;
	}

	if ( filter.page !== 1 ) {
		return false;
	}

	return true;
};

const AdminContent = ( { selectedDate } ) => {
	const translate = useTranslate();
	const siteId = useSelector( getSelectedSiteId );
	const siteSlug = useSelector( getSelectedSiteSlug );

	const activityLogFilter = useSelector( ( state ) => getActivityLogFilter( state, siteId ) );
	const isFiltering = ! isFilterEmpty( activityLogFilter );

	const needCredentials = useSelector( ( state ) => getDoesRewindNeedCredentials( state, siteId ) );

	const onDateChange = ( date ) =>
		page( backupMainPath( siteSlug, { date: date.format( INDEX_FORMAT ) } ) );

	const backupStorageSpace = getForCurrentCROIteration( {
		[ Iterations.ONLY_REALTIME_PRODUCTS ]: <BackupStorageSpace />,
	} );

	return (
		<>
			<QueryRewindCapabilities siteId={ siteId } />
			<QueryRewindState siteId={ siteId } />

			{ isFiltering && <SearchResults /> }

			{ ! isFiltering && (
				<>
					<DocumentHead title={ translate( 'Latest backups' ) } />
					<PageViewTracker path="/backup/:site" title="Backups" />

					<div className="backup__main-wrap">
						<div className="backup__last-backup-status">
							{ needCredentials && <EnableRestoresBanner /> }

							<BackupDatePicker onDateChange={ onDateChange } selectedDate={ selectedDate } />
							{ backupStorageSpace }
							<BackupStatus selectedDate={ selectedDate } />
						</div>
					</div>
				</>
			) }
		</>
	);
};

const BackupStatus = ( { selectedDate } ) => {
	const siteId = useSelector( getSelectedSiteId );
	const rewindCapabilities = useSelector( ( state ) => getRewindCapabilities( state, siteId ) );

	if ( ! Array.isArray( rewindCapabilities ) ) {
		return <BackupPlaceholder showDatePicker={ false } />;
	}

	const hasRealtimeBackups = rewindCapabilities.includes( 'backup-realtime' );

	if ( isEnabled( 'jetpack/backup-simplified-screens-i4' ) ) {
		return hasRealtimeBackups ? (
			<RealtimeStatusSimplifiedI4 selectedDate={ selectedDate } />
		) : (
			<DailyStatusSimplifiedI4 selectedDate={ selectedDate } />
		);
	}

	return hasRealtimeBackups ? (
		<RealtimeStatus selectedDate={ selectedDate } />
	) : (
		<DailyStatus selectedDate={ selectedDate } />
	);
};

export default BackupPage;
