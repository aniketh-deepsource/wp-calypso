import { Button } from '@automattic/components';
import { translate } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { contextTypes } from '../context-types';

export default class Next extends Component {
	static displayName = 'Next';

	static propTypes = {
		step: PropTypes.string.isRequired,
	};

	static contextTypes = contextTypes;

	constructor( props, context ) {
		super( props, context );
	}

	onClick = () => {
		const { next, tour, tourVersion, step } = this.context;
		const { step: nextStepName } = this.props;
		next( { tour, tourVersion, step, nextStepName } );
	};

	render() {
		const { children } = this.props;
		return (
			<Button primary onClick={ this.onClick }>
				{ children || translate( 'Next' ) }
			</Button>
		);
	}
}
