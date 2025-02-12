import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import EmptyContent from 'calypso/components/empty-content';
import { withPerformanceTrackerStop } from 'calypso/lib/performance-tracking';
import { recordAction, recordGaEvent } from 'calypso/reader/stats';
import { recordReaderTracksEvent } from 'calypso/state/reader/analytics/actions';

class SearchEmptyContent extends React.Component {
	static propTypes = {
		query: PropTypes.string,
	};

	shouldComponentUpdate() {
		return false;
	}

	recordAction = () => {
		recordAction( 'clicked_following_on_empty' );
		recordGaEvent( 'Clicked Following on EmptyContent' );
		this.props.recordReaderTracksEvent( 'calypso_reader_following_on_empty_search_stream_clicked' );
	};

	render() {
		/* eslint-disable wpcalypso/jsx-classname-namespace */
		const action = (
			<a
				className="empty-content__action button is-primary"
				onClick={ this.recordAction }
				href="/read"
			>
				{ this.props.translate( 'Back to Following' ) }
			</a>
		);

		const message = this.props.translate( 'No posts found for {{query /}} for your language.', {
			components: {
				query: <em>{ this.props.query }</em>,
			},
		} );

		return (
			<EmptyContent
				title={ this.props.translate( 'No results' ) }
				line={ message }
				action={ action }
				illustration={ '/calypso/images/illustrations/illustration-empty-results.svg' }
				illustrationWidth={ 400 }
			/>
		);
		/* eslint-enable wpcalypso/jsx-classname-namespace */
	}
}

export default connect( null, {
	recordReaderTracksEvent,
} )( withPerformanceTrackerStop( localize( SearchEmptyContent ) ) );
