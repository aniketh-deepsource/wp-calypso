import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './style.scss';

export default function Column( { children, type, className } ) {
	const columnClasses = classnames(
		'layout__column',
		type === 'main' && 'layout__column--main',
		type === 'sidebar' && 'layout__column--sidebar',
		className
	);

	return <div className={ columnClasses }>{ children }</div>;
}

Column.propTypes = {
	className: PropTypes.string,
	type: PropTypes.string.isRequired,
};
