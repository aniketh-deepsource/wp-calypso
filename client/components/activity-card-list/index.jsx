import { isEnabled } from '@automattic/calypso-config';
import { withMobileBreakpoint } from '@automattic/viewport-react';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ActivityCard from 'calypso/components/activity-card';
import QueryActivityLogRetentionPolicy from 'calypso/components/data/query-activity-log-retention-policy';
import QueryRewindCapabilities from 'calypso/components/data/query-rewind-capabilities';
import QueryRewindState from 'calypso/components/data/query-rewind-state';
import { withLocalizedMoment } from 'calypso/components/localized-moment';
import Pagination from 'calypso/components/pagination';
import { withApplySiteOffset } from 'calypso/components/site-offset';
import { isActivityBackup } from 'calypso/lib/jetpack/backup-utils';
import Filterbar from 'calypso/my-sites/activity/filterbar';
import { updateFilter } from 'calypso/state/activity-log/actions';
import { getCurrentUserLocale } from 'calypso/state/current-user/selectors';
import getActivityLogFilter from 'calypso/state/selectors/get-activity-log-filter';
import getSiteActivityLogRetentionDays from 'calypso/state/selectors/get-site-activity-log-retention-days';
import getSiteActivityLogRetentionPolicyRequestStatus from 'calypso/state/selectors/get-site-activity-log-retention-policy-request-status';
import { getSelectedSiteId, getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import RetentionLimitUpsell from './retention-limit-upsell';

import './style.scss';

class ActivityCardList extends Component {
	static propTypes = {
		logs: PropTypes.array,
		pageSize: PropTypes.number.isRequired,
		showDateSeparators: PropTypes.bool,
		showFilter: PropTypes.bool,
		showPagination: PropTypes.bool,
	};

	static defaultProps = {
		showDateSeparators: true,
		showFilter: true,
		showPagination: true,
	};

	changePage = ( pageNumber ) => {
		this.props.selectPage( this.props.siteId, pageNumber );
		window.scrollTo( 0, 0 );
	};

	splitLogsByDate( logs ) {
		const { applySiteOffset, moment, pageSize } = this.props;
		const logsByDate = [];
		let lastDate = null;
		let logsAdded = 0;

		for ( const log of logs ) {
			const activityDateMoment = ( applySiteOffset ?? moment )( log.activityDate );

			if ( logsAdded >= pageSize ) {
				if ( lastDate && lastDate.isSame( activityDateMoment, 'day' ) ) {
					logsByDate[ logsByDate.length - 1 ].hasMore = true;
				}
				break;
			} else {
				if ( lastDate && lastDate.isSame( activityDateMoment, 'day' ) ) {
					logsByDate[ logsByDate.length - 1 ].logs.push( log );
				} else {
					logsByDate.push( { date: activityDateMoment, logs: [ log ], hasMore: false } );
					lastDate = activityDateMoment;
				}
				logsAdded++;
			}
		}

		return logsByDate;
	}

	renderLogs( pageLogs ) {
		const { applySiteOffset, moment, showDateSeparators, translate, userLocale } = this.props;

		const today = ( applySiteOffset ?? moment )();

		const getPrimaryCardClassName = ( hasMore, dateLogsLength ) =>
			hasMore && dateLogsLength === 1
				? 'activity-card-list__primary-card-with-more'
				: 'activity-card-list__primary-card';

		const getSecondaryCardClassName = ( hasMore ) =>
			hasMore
				? 'activity-card-list__secondary-card-with-more'
				: 'activity-card-list__secondary-card';

		const dateFormat = userLocale === 'en' ? 'MMM Do' : 'LL';

		return pageLogs.map( ( { date, logs: dateLogs, hasMore }, index ) => (
			<div key={ `activity-card-list__date-group-${ index }` }>
				{ showDateSeparators && (
					<div className="activity-card-list__date-group-date">
						{ date &&
							( today?.isSame( date, 'day' ) ? translate( 'Today' ) : date.format( dateFormat ) ) }
					</div>
				) }
				<div className="activity-card-list__date-group-content">
					{ dateLogs.map( ( activity ) => (
						<ActivityCard
							activity={ activity }
							className={
								isActivityBackup( activity )
									? getPrimaryCardClassName( hasMore, dateLogs.length )
									: getSecondaryCardClassName( hasMore )
							}
							key={ activity.activityId }
						/>
					) ) }
				</div>
			</div>
		) );
	}

	renderData() {
		const {
			applySiteOffset,
			moment,
			retentionPoliciesEnabled,
			retentionDays,
			filter,
			isBreakpointActive: isMobile,
			logs,
			pageSize,
			showFilter,
			showPagination,
			siteId,
		} = this.props;

		const retentionLimitCutoffDate = retentionPoliciesEnabled
			? ( applySiteOffset ?? moment )().subtract( retentionDays, 'days' )
			: null;
		const logsWithRetention = retentionPoliciesEnabled
			? logs.filter( ( log ) =>
					( applySiteOffset ?? moment )( log.activityDate ).isSameOrAfter(
						retentionLimitCutoffDate,
						'day'
					)
			  )
			: logs;

		const { page: requestedPage } = filter;
		const pageCount = Math.ceil( logsWithRetention.length / pageSize );
		const actualPage = Math.max( 1, Math.min( requestedPage, pageCount ) );

		const pageLogs = this.splitLogsByDate(
			logsWithRetention.slice( ( actualPage - 1 ) * pageSize )
		);
		const showRetentionLimitUpsell =
			retentionPoliciesEnabled && logsWithRetention.length < logs.length && actualPage >= pageCount;

		return (
			<div className="activity-card-list">
				{ showFilter && (
					<Filterbar
						{ ...{
							siteId,
							filter,
							isLoading: false,
							isVisible: true,
						} }
					/>
				) }
				{ showPagination && (
					<Pagination
						compact={ isMobile }
						className="activity-card-list__pagination-top"
						key="activity-card-list__pagination-top"
						nextLabel={ 'Older' }
						page={ actualPage }
						pageClick={ this.changePage }
						perPage={ pageSize }
						prevLabel={ 'Newer' }
						total={ logsWithRetention.length }
					/>
				) }
				{ this.renderLogs( pageLogs ) }
				{ showRetentionLimitUpsell && (
					<RetentionLimitUpsell cardClassName="activity-card-list__primary-card-with-more" />
				) }
				{ showPagination && (
					<Pagination
						compact={ isMobile }
						className="activity-card-list__pagination-bottom"
						key="activity-card-list__pagination-bottom"
						nextLabel={ 'Older' }
						page={ actualPage }
						pageClick={ this.changePage }
						perPage={ pageSize }
						prevLabel={ 'Newer' }
						total={ logsWithRetention.length }
					/>
				) }
			</div>
		);
	}

	renderLoading() {
		const { showPagination, showDateSeparators, isBreakpointActive } = this.props;

		/* eslint-disable wpcalypso/jsx-classname-namespace */
		return (
			<div className="activity-card-list__loading-placeholder">
				<div className="filterbar" />
				{ showPagination && (
					<div
						className={ classNames( 'activity-card-list__pagination-top', {
							'is-compact': isBreakpointActive,
						} ) }
					/>
				) }
				<div key="activity-card-list__date-group-loading">
					{ showDateSeparators && (
						<div className="activity-card-list__date-group-date">
							<span>MMM Do</span>
						</div>
					) }
					<div className="activity-card-list__date-group-content">
						{ [ 1, 2, 3 ].map( ( i ) => (
							<div
								className="activity-card-list__secondary-card activity-card"
								key={ `loading-secondary-${ i }` }
							>
								<div className="activity-card__time">
									<div className="activity-card__time-text">Sometime</div>
								</div>
								<div className="card" />
							</div>
						) ) }
						<div className="activity-card-list__primary-card activity-card">
							<div className="activity-card__time">
								<div className="activity-card__time-text">Sometime</div>
							</div>
							<div className="card" />
						</div>
					</div>
				</div>
				{ showPagination && (
					<div
						className={ classNames( 'activity-card-list__pagination-bottom', {
							'is-compact': isBreakpointActive,
						} ) }
					/>
				) }
			</div>
		);
		/* eslint-disable wpcalypso/jsx-classname-namespace */
	}

	render() {
		const {
			retentionPoliciesEnabled,
			requestingRetentionPolicy,
			retentionPolicyRequestError,
			siteId,
			logs,
		} = this.props;

		if ( retentionPoliciesEnabled && retentionPolicyRequestError ) {
			return this.renderLoading();
		}

		return (
			<>
				{ retentionPoliciesEnabled && <QueryActivityLogRetentionPolicy siteId={ siteId } /> }
				<QueryRewindCapabilities siteId={ siteId } />
				<QueryRewindState siteId={ siteId } />

				{ ( ! logs || ( retentionPoliciesEnabled && requestingRetentionPolicy ) ) &&
					this.renderLoading() }
				{ logs && this.renderData() }
			</>
		);
	}
}

const mapStateToProps = ( state ) => {
	const siteId = getSelectedSiteId( state );
	const siteSlug = getSelectedSiteSlug( state );

	const filter = getActivityLogFilter( state, siteId );
	const userLocale = getCurrentUserLocale( state );
	const retentionDays = getSiteActivityLogRetentionDays( state, siteId );

	const retentionPolicyRequestStatus = getSiteActivityLogRetentionPolicyRequestStatus(
		state,
		siteId
	);

	return {
		filter,
		retentionPoliciesEnabled: isEnabled( 'activity-log/retention-policies' ),
		requestingRetentionPolicy: retentionPolicyRequestStatus === 'pending',
		retentionPolicyRequestError: retentionPolicyRequestStatus === 'failure',
		retentionDays,
		siteId,
		siteSlug,
		userLocale,
	};
};

const mapDispatchToProps = ( dispatch ) => ( {
	selectPage: ( siteId, pageNumber ) => dispatch( updateFilter( siteId, { page: pageNumber } ) ),
} );

/** @type {typeof ActivityCardList} */
const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withMobileBreakpoint( withApplySiteOffset( withLocalizedMoment( localize( ActivityCardList ) ) ) )
);

export default connectedComponent;
