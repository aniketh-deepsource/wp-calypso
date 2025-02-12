import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThemesList from 'calypso/components/themes-list';
import getThemes from 'calypso/lib/signup/themes';
import './style.scss';

const noop = () => {};

class SignupThemesList extends Component {
	static propTypes = {
		surveyQuestion: PropTypes.string,
		designType: PropTypes.string,
		quantity: PropTypes.number,
		handleScreenshotClick: PropTypes.func,
		translate: PropTypes.func,
	};

	static defaultProps = {
		surveyQuestion: null,
		designType: null,
		quantity: 3,
		handleScreenshotClick: noop,
	};

	shouldComponentUpdate( nextProps ) {
		return (
			nextProps.surveyQuestion !== this.props.surveyQuestion ||
			nextProps.designType !== this.props.designType
		);
	}

	getComputedThemes() {
		return getThemes( this.props.surveyQuestion, this.props.designType, this.props.quantity );
	}

	getScreenshotUrl( theme ) {
		return `https://i1.wp.com/s0.wp.com/wp-content/themes/${ theme.repo }/${ theme.slug }/screenshot.png?w=660`;
	}

	render() {
		const actionLabel = this.props.translate( 'Pick' );
		const getActionLabel = () => actionLabel;

		const themes = this.getComputedThemes().map( ( theme ) => {
			return {
				...theme,
				id: theme.slug,
				screenshot: this.getScreenshotUrl( theme ),
			};
		} );

		return (
			<div className="signup-themes-list">
				<ThemesList
					getButtonOptions={ noop }
					onScreenshotClick={ this.props.handleScreenshotClick }
					onMoreButtonClick={ noop }
					getActionLabel={ getActionLabel }
					themes={ themes }
				/>
			</div>
		);
	}
}

export default localize( SignupThemesList );
