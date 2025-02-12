/**
 * @jest-environment jsdom
 */

import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { BulkSelect } from '../index';

const noop = () => {};
const translate = ( string ) => string;

describe( 'index', () => {
	test( 'should have BulkSelect class', () => {
		const bulkSelect = shallow(
			<BulkSelect
				translate={ translate }
				selectedElements={ 0 }
				totalElements={ 3 }
				onToggle={ noop }
			/>
		);
		assert.equal( 1, bulkSelect.find( '.bulk-select' ).length );
	} );

	test( 'should not be checked when initialized without selectedElements', () => {
		const bulkSelect = shallow(
			<BulkSelect
				translate={ translate }
				selectedElements={ 0 }
				totalElements={ 3 }
				onToggle={ noop }
			/>
		);
		assert.equal( 0, bulkSelect.find( '.is-checked' ).length );
	} );

	test( 'should be checked when initialized with all elements selected', () => {
		const bulkSelect = shallow(
			<BulkSelect
				translate={ translate }
				selectedElements={ 3 }
				totalElements={ 3 }
				onToggle={ noop }
			/>
		);
		assert.equal( 1, bulkSelect.find( '.is-checked' ).length );
	} );

	test( 'should not be checked when initialized with some elements selected', () => {
		const bulkSelect = shallow(
			<BulkSelect
				translate={ translate }
				selectedElements={ 2 }
				totalElements={ 3 }
				onToggle={ noop }
			/>
		);
		assert.equal( 0, bulkSelect.find( '.is-checked' ).length );
	} );

	test( 'should render line gridicon when initialized with some elements selected', () => {
		const bulkSelect = shallow(
			<BulkSelect
				translate={ translate }
				selectedElements={ 2 }
				totalElements={ 3 }
				onToggle={ noop }
			/>
		);
		assert.equal( 1, bulkSelect.find( '.bulk-select__some-checked-icon' ).length );
	} );

	test( 'should add the aria-label to the input', () => {
		const bulkSelect = mount(
			<BulkSelect
				translate={ translate }
				selectedElements={ 2 }
				totalElements={ 3 }
				onToggle={ noop }
				ariaLabel="Select All"
			/>
		);
		assert.equal( 'Select All', bulkSelect.find( 'input' ).prop( 'aria-label' ) );
	} );

	test( 'should not mark the input readOnly', () => {
		const bulkSelect = mount(
			<BulkSelect
				translate={ translate }
				selectedElements={ 2 }
				totalElements={ 3 }
				onToggle={ noop }
			/>
		);
		// There is no prop readOnly, so this is undefined
		assert.equal( undefined, bulkSelect.find( 'input' ).prop( 'readOnly' ) );
	} );

	test( 'should be call onToggle when clicked', () => {
		let hasBeenCalled = false;
		const callback = function () {
			hasBeenCalled = true;
		};
		const bulkSelect = mount(
			<BulkSelect
				translate={ translate }
				selectedElements={ 0 }
				totalElements={ 3 }
				onToggle={ callback }
			/>
		);
		bulkSelect.find( 'input' ).simulate( 'change' );
		assert.equal( hasBeenCalled, true );
	} );

	test( 'should be call onToggle with the new state when there are no selected elements', () => {
		return new Promise( ( done ) => {
			const callback = function ( newState ) {
				assert.equal( newState, true );
				done();
			};
			const bulkSelect = mount(
				<BulkSelect
					translate={ translate }
					selectedElements={ 0 }
					totalElements={ 3 }
					onToggle={ callback }
				/>
			);
			bulkSelect.find( 'input' ).simulate( 'change' );
		} );
	} );

	test( 'should be call onToggle with the new state when there are some selected elements', () => {
		return new Promise( ( done ) => {
			const callback = function ( newState ) {
				assert.equal( newState, false );
				done();
			};
			const bulkSelect = mount(
				<BulkSelect
					translate={ translate }
					selectedElements={ 1 }
					totalElements={ 3 }
					onToggle={ callback }
				/>
			);
			bulkSelect.find( 'input' ).simulate( 'change' );
		} );
	} );

	test( 'should be call onToggle with the new state when there all elements are selected', () => {
		return new Promise( ( done ) => {
			const callback = function ( newState ) {
				assert.equal( newState, false );
				done();
			};
			const bulkSelect = mount(
				<BulkSelect
					translate={ translate }
					selectedElements={ 3 }
					totalElements={ 3 }
					onToggle={ callback }
				/>
			);
			bulkSelect.find( 'input' ).simulate( 'change' );
		} );
	} );
} );
