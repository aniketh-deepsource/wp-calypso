import classNames from 'classnames';
import { isEmpty, map, partialRight } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import './style.scss';

const addLinesToOperations = ( operations ) => {
	if ( ! Array.isArray( operations ) || isEmpty( operations ) ) {
		return operations;
	}
	return operations.join( '\n\n' );
};

const renderOperation = ( operation, operationIndex, splitLines ) => {
	const { orig, final, value, op } = operation;
	const content = orig || final || value;

	const classnames = classNames( {
		'text-diff__additions': op === 'add',
		'text-diff__context': op === 'copy',
		'text-diff__deletions': op === 'del',
	} );

	return (
		<span className={ classnames } key={ operationIndex }>
			{ splitLines ? addLinesToOperations( content ) : content }
		</span>
	);
};

const renderSplitLineOperations = partialRight( renderOperation, true );

const TextDiff = ( { operations, splitLines } ) =>
	map( operations, splitLines ? renderSplitLineOperations : renderOperation );

TextDiff.propTypes = {
	operations: PropTypes.arrayOf(
		PropTypes.shape( {
			op: PropTypes.oneOf( [ 'add', 'copy', 'del' ] ),
			value: PropTypes.string.isRequired,
		} )
	),
	splitLines: PropTypes.bool,
};

export default TextDiff;
