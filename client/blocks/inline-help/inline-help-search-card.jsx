import debugFactory from 'debug';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchCard from 'calypso/components/search-card';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { setInlineHelpSearchQuery } from 'calypso/state/inline-help/actions';
import getInlineHelpCurrentlySelectedLink from 'calypso/state/inline-help/selectors/get-inline-help-currently-selected-link';
import isRequestingInlineHelpSearchResultsForQuery from 'calypso/state/inline-help/selectors/is-requesting-inline-help-search-results-for-query';

/**
 * Module variables
 */
const debug = debugFactory( 'calypso:inline-help' );

const InlineHelpSearchCard = ( {
	query = '',
	track,
	location = 'inline-help-popover',
	setSearchQuery,
	isSearching,
	isVisible = true,
	placeholder,
	translate,
} ) => {
	const cardRef = useRef();

	// Focus in the input element.
	useEffect( () => {
		const inputElement = cardRef.current?.searchInput;
		// Focuses only in the popover.
		if ( location !== 'inline-help-popover' || ! inputElement || ! isVisible ) {
			return;
		}

		const timerId = setTimeout( () => inputElement.focus(), 0 );

		return () => window.clearTimeout( timerId );
	}, [ cardRef, location, isVisible ] );

	const searchHelperHandler = ( searchQuery ) => {
		const inputQuery = searchQuery.trim();

		if ( inputQuery?.length ) {
			debug( 'search query received: ', searchQuery );
			track( 'calypso_inlinehelp_search', {
				search_query: searchQuery,
				location: location,
			} );
		}

		// Set the query search
		setSearchQuery( searchQuery );
	};

	return (
		<SearchCard
			ref={ cardRef }
			searching={ isSearching }
			initialValue={ query }
			onSearch={ searchHelperHandler }
			placeholder={ placeholder || translate( 'Search for help…' ) }
			delaySearch={ true }
		/>
	);
};

InlineHelpSearchCard.propTypes = {
	translate: PropTypes.func,
	track: PropTypes.func,
	query: PropTypes.string,
	placeholder: PropTypes.string,
	location: PropTypes.string,
};

const mapStateToProps = ( state, ownProps ) => ( {
	isSearching: isRequestingInlineHelpSearchResultsForQuery( state, ownProps.query ),
	selectedLink: getInlineHelpCurrentlySelectedLink( state ),
} );
const mapDispatchToProps = {
	track: recordTracksEvent,
	setSearchQuery: setInlineHelpSearchQuery,
};

export default connect( mapStateToProps, mapDispatchToProps )( localize( InlineHelpSearchCard ) );
