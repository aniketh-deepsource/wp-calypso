import classNames from 'classnames';
import { omit } from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import './style.scss';

export default class FormTextInput extends PureComponent {
	static propTypes = {
		isError: PropTypes.bool,
		isValid: PropTypes.bool,
		selectOnFocus: PropTypes.bool,
		className: PropTypes.string,
	};

	state = {
		value: this.props.value || '',
	};

	currentTextField = undefined;

	componentDidUpdate( oldProps ) {
		this.updateValueIfNeeded( oldProps.value );
	}

	updateValueIfNeeded( oldValue ) {
		const { value } = this.props;
		if ( oldValue !== value || value !== this.state.value ) {
			this.setState( { value } );
		}
	}

	textFieldRef = ( element ) => {
		this.currentTextField = element;

		const { inputRef } = this.props;

		if ( ! inputRef ) {
			return;
		}

		if ( typeof inputRef === 'function' ) {
			inputRef( element );
		} else {
			inputRef.current = element;
		}
	};

	focus() {
		if ( this.currentTextField ) {
			this.currentTextField.focus();
		}
	}

	selectOnFocus = ( event ) => {
		if ( this.props.selectOnFocus ) {
			event.target.select();
		}
	};

	onChange = ( event ) => {
		this.setState( { value: event.target.value } );
		this.props.onChange?.( event );
	};

	render() {
		const props = omit(
			this.props,
			'isError',
			'isValid',
			'selectOnFocus',
			'inputRef',
			'onChange',
			'value'
		);

		const classes = classNames( 'form-text-input', this.props.className, {
			'is-error': this.props.isError,
			'is-valid': this.props.isValid,
		} );

		return (
			<input
				type="text"
				{ ...props }
				value={ this.state.value }
				ref={ this.textFieldRef }
				className={ classes }
				onClick={ this.selectOnFocus }
				onChange={ this.onChange }
			/>
		);
	}
}
