import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestTagImages } from 'calypso/state/reader/tags/images/actions';
import { shouldRequestTagImages } from 'calypso/state/reader/tags/images/selectors';

class QueryReaderTagImages extends Component {
	UNSAFE_componentWillMount() {
		if ( ! this.props.shouldRequestTagImages || ! this.props.tag ) {
			return;
		}

		this.props.requestTagImages( this.props.tag );
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		if ( ! nextProps.shouldRequestTagImages ) {
			return;
		}

		this.props.requestTagImages( nextProps.tag );
	}

	render() {
		return null;
	}
}

QueryReaderTagImages.propTypes = {
	shouldRequestTagImages: PropTypes.bool,
	requestTagImages: PropTypes.func,
};

QueryReaderTagImages.defaultProps = {
	requestTagImages: () => {},
};

export default connect(
	( state, ownProps ) => {
		return {
			shouldRequestTagImages: shouldRequestTagImages( state, ownProps.tag ),
		};
	},
	{
		requestTagImages,
	}
)( QueryReaderTagImages );
