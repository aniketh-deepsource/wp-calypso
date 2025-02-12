import { FocalPointPicker } from '@wordpress/components';
import React, { useState } from 'react';

const FocalPointPickerExample = () => {
	const url = 'https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm';

	const [ focalPoint, setFocalPoint ] = useState( {
		x: 0.5,
		y: 0.5,
	} );

	return <FocalPointPicker value={ focalPoint } onChange={ setFocalPoint } url={ url } />;
};

export default FocalPointPickerExample;
