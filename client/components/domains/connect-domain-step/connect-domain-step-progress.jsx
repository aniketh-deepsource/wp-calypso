/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Gridicon from 'calypso/components/gridicon';
import { stepSlug } from 'calypso/components/domains/connect-domain-step/constants';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepProgress( { baseClassName, steps, currentPageSlug } ) {
	let currentStepNumber = 0;

	return (
		<div className={ baseClassName + '__progress' }>
			{ Object.values( steps )
				.map( ( stepName, index ) => {
					const stepNumber = index + 1;
					if ( stepName === steps[ currentPageSlug ] ) {
						currentStepNumber = stepNumber;
					}

					const stepCompleted = 0 === currentStepNumber || currentStepNumber > stepNumber;

					const stepNumberClasses = classNames( baseClassName + '__progress-number', {
						'current-step': currentStepNumber === stepNumber,
						'completed-step': stepCompleted,
					} );

					const stepNameClasses = classNames( baseClassName + '__progress-step-name', {
						'current-step': currentStepNumber === stepNumber,
					} );

					const stepNumberContent = stepCompleted ? (
						<Gridicon
							className={ baseClassName + '__progress-number-checkmark' }
							icon="checkmark"
							size={ 16 } /* eslint-disable-line */
						/>
					) : (
						stepNumber
					);

					return (
						<div className={ baseClassName + '__progress-step' } key={ 'step-' + stepNumber }>
							<span className={ stepNumberClasses }>{ stepNumberContent }</span>
							<span className={ stepNameClasses }>{ stepName }</span>
						</div>
					);
				} )
				.reduce( ( list, element, index ) => {
					return list === null
						? [ element ]
						: [
								...list,
								<Gridicon
									className={ baseClassName + '__progress-step-separator' }
									key={ 'icon-' + index }
									icon="chevron-right"
									size={ 20 } /* eslint-disable-line */
								/>,
								element,
						  ];
				}, null ) }
		</div>
	);
}

ConnectDomainStepProgress.propTypes = {
	baseClassName: PropTypes.string.isRequired,
	steps: PropTypes.object.isRequired,
	currentPageSlug: PropTypes.oneOf( Object.values( stepSlug ) ).isRequired,
};
