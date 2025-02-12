/**
 * @jest-environment jsdom
 */

import { assert } from 'chai';
import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import sinon from 'sinon';
import SectionNav from '../';

jest.mock( 'gridicons', () => require( 'calypso/components/empty-component' ) );
jest.mock( 'calypso/lib/analytics/ga', () => ( {
	recordEvent: () => {},
} ) );

function createComponent( component, props, children ) {
	const renderer = new ShallowRenderer();

	renderer.render( React.createElement( component, props, children ) );
	return renderer.getRenderOutput();
}

describe( 'section-nav', () => {
	describe( 'rendering', () => {
		let headerElem;
		let headerTextElem;
		let panelElem;
		let sectionNav;
		let text;

		beforeAll( function () {
			const selectedText = 'test';
			const children = <p>mmyellow</p>;

			sectionNav = createComponent(
				SectionNav,
				{
					selectedText: selectedText,
				},
				children
			);

			panelElem = sectionNav.props.children[ 1 ];
			headerElem = sectionNav.props.children[ 0 ];
			headerTextElem = headerElem.props.children[ 0 ];
			text = headerTextElem.props.children;
		} );

		test( 'should render a header and a panel', () => {
			assert.equal( headerElem.props.className, 'section-nav__mobile-header' );
			assert.equal( panelElem.props.className, 'section-nav__panel' );
			assert.equal( headerTextElem.props.className, 'section-nav__mobile-header-text' );
		} );

		test( 'should render selectedText within mobile header', () => {
			assert.equal( text, 'test' );
		} );

		test( 'should render children', () => {
			return new Promise( ( done ) => {
				//React.Children.only should work here but gives an error about not being the only child
				React.Children.map( panelElem.props.children, function ( obj ) {
					if ( obj.type === 'p' ) {
						assert.equal( obj.props.children, 'mmyellow' );
						done();
					}
				} );
			} );
		} );

		test( 'should not render a header if dropdown disabled', () => {
			const component = createComponent(
				SectionNav,
				{
					selectedText: 'test',
					allowDropdown: false,
				},
				<p>mmyellow</p>
			);

			const header = component.props.children.find(
				( child ) => child && child.className === 'section-nav__mobile-header'
			);
			assert.equal( header, null );
		} );
	} );

	describe( 'interaction', () => {
		test( 'should call onMobileNavPanelOpen function passed as a prop when tapped', () => {
			return new Promise( ( done ) => {
				const elem = React.createElement(
					SectionNav,
					{
						selectedText: 'placeholder',
						onMobileNavPanelOpen: function () {
							done();
						},
					},
					<p>placeholder</p>
				);
				const tree = TestUtils.renderIntoDocument( elem );
				assert( ! tree.state.mobileOpen );
				TestUtils.Simulate.click(
					ReactDom.findDOMNode(
						TestUtils.findRenderedDOMComponentWithClass( tree, 'section-nav__mobile-header' )
					)
				);
				assert( tree.state.mobileOpen );
			} );
		} );

		test( 'should call onMobileNavPanelOpen function passed as a prop twice when tapped three times', () => {
			return new Promise( ( done ) => {
				const spy = sinon.spy();
				const elem = React.createElement(
					SectionNav,
					{
						selectedText: 'placeholder',
						onMobileNavPanelOpen: spy,
					},
					<p>placeholder</p>
				);
				const tree = TestUtils.renderIntoDocument( elem );

				assert( ! tree.state.mobileOpen );
				TestUtils.Simulate.click(
					ReactDom.findDOMNode(
						TestUtils.findRenderedDOMComponentWithClass( tree, 'section-nav__mobile-header' )
					)
				);
				assert( tree.state.mobileOpen );
				TestUtils.Simulate.click(
					ReactDom.findDOMNode(
						TestUtils.findRenderedDOMComponentWithClass( tree, 'section-nav__mobile-header' )
					)
				);
				assert( ! tree.state.mobileOpen );
				TestUtils.Simulate.click(
					ReactDom.findDOMNode(
						TestUtils.findRenderedDOMComponentWithClass( tree, 'section-nav__mobile-header' )
					)
				);
				assert( tree.state.mobileOpen );

				assert( spy.calledTwice );
				done();
			} );
		} );
	} );
} );
