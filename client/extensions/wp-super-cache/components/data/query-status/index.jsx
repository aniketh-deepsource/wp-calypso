import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestStatus } from '../../../state/status/actions';
import { isRequestingStatus } from '../../../state/status/selectors';

class QueryStatus extends Component {
	UNSAFE_componentWillMount() {
		this.requestStatus( this.props );
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		const { siteId } = this.props;

		if ( ! nextProps.siteId || siteId === nextProps.siteId ) {
			return;
		}

		this.requestStatus( nextProps );
	}

	requestStatus( props ) {
		const { requestingStatus, siteId } = props;

		if ( ! requestingStatus && siteId ) {
			props.requestStatus( siteId );
		}
	}

	render() {
		return null;
	}
}

QueryStatus.propTypes = {
	siteId: PropTypes.number,
	requestingStatus: PropTypes.bool,
	requestStatus: PropTypes.func,
};

export default connect(
	( state, { siteId } ) => {
		return {
			requestingStatus: isRequestingStatus( state, siteId ),
		};
	},
	{ requestStatus }
)( QueryStatus );
