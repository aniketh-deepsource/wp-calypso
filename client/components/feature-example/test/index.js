import { assert } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FeatureExample from '../index';

describe( 'Feature Example', () => {
	test( 'should have Feature-example class', () => {
		const featureExample = shallow( <FeatureExample /> );
		assert.lengthOf( featureExample.find( '.feature-example' ), 1 );
	} );

	test( 'should contains the passed children wrapped by a feature-example div', () => {
		const featureExample = shallow(
			<FeatureExample>
				<div>test</div>
			</FeatureExample>
		);
		assert.isTrue( featureExample.contains( <div>test</div> ) );
	} );
} );
