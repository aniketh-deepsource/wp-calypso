import { Component } from 'react';
import { connect } from 'react-redux';
import { requestZones } from '../../../state/zones/actions';
import { isRequestingZones } from '../../../state/zones/selectors';

class QueryZones extends Component {
	UNSAFE_componentWillMount() {
		this.requestZones( this.props );
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		if ( ! nextProps.siteId || this.props.siteId === nextProps.siteId ) {
			return;
		}

		this.requestZones( nextProps );
	}

	requestZones( props ) {
		const { fetchingZones, siteId } = props;

		if ( ! fetchingZones && siteId ) {
			props.requestZones( siteId );
		}
	}

	render() {
		return null;
	}
}

const connectComponent = connect(
	( state, { siteId } ) => ( { fetchingZones: isRequestingZones( state, siteId ) } ),
	{ requestZones }
);

export default connectComponent( QueryZones );
