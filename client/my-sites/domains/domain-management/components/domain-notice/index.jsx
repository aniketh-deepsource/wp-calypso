/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import Gridicon from 'calypso/components/gridicon';
import classnames from 'classnames';

/**
 * Style dependencies
 */
import './style.scss';
import MaterialIcon from 'calypso/components/material-icon';

export default class DomainNotice extends React.Component {
	static propTypes = {
		text: PropTypes.oneOfType( [ PropTypes.string, PropTypes.array ] ),
		status: PropTypes.oneOf( [ 'success', 'info', 'warning', 'alert', 'verifying' ] ),
		className: PropTypes.string,
	};

	static defaultProps = {
		status: 'info',
	};

	renderGridIcon( icon ) {
		return <Gridicon icon={ icon } size={ 18 } />;
	}

	renderIcon() {
		const { status } = this.props;
		switch ( status ) {
			case 'info':
				return this.renderGridIcon( 'time' );
			case 'success':
				return this.renderGridIcon( 'checkmark' );
			case 'verifying':
				return <MaterialIcon icon="compare_arrows" />;
			default:
				return this.renderGridIcon( 'notice-outline' );
		}
	}

	render() {
		const { status, text, className } = this.props;

		const classes = classnames( 'domain-notice', `domain-notice__${ status }`, className );

		return (
			<span className={ classes }>
				{ this.renderIcon() }
				{ text }
			</span>
		);
	}
}
