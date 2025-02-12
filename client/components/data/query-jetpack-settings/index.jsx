import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestJetpackSettings } from 'calypso/state/jetpack/settings/actions';
import isRequestingJetpackSettings from 'calypso/state/selectors/is-requesting-jetpack-settings';

class QueryJetpackSettings extends Component {
	static propTypes = {
		query: PropTypes.object,
		siteId: PropTypes.number,
		// Connected props
		requestingSettings: PropTypes.bool,
		requestJetpackSettings: PropTypes.func,
	};

	UNSAFE_componentWillMount() {
		this.request( this.props );
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		if ( this.props.siteId !== nextProps.siteId ) {
			this.request( nextProps );
		}
	}

	request( props ) {
		if ( props.requestingSettings || ! props.siteId ) {
			return;
		}

		props.requestJetpackSettings( props.siteId, props.query );
	}

	render() {
		return null;
	}
}

export default connect(
	( state, { query, siteId } ) => ( {
		requestingSettings: isRequestingJetpackSettings( state, siteId, query ),
	} ),
	{ requestJetpackSettings }
)( QueryJetpackSettings );
