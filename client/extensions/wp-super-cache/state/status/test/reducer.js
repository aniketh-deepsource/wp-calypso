import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import { serialize, deserialize } from 'calypso/state/utils';
import { useSandbox } from 'calypso/test-helpers/use-sinon';
import {
	WP_SUPER_CACHE_RECEIVE_STATUS,
	WP_SUPER_CACHE_REQUEST_STATUS,
	WP_SUPER_CACHE_REQUEST_STATUS_FAILURE,
} from '../../action-types';
import reducer from '../reducer';

describe( 'reducer', () => {
	const primarySiteId = 123456;
	const secondarySiteId = 456789;

	useSandbox( ( sandbox ) => {
		sandbox.stub( console, 'warn' );
	} );

	describe( 'requesting()', () => {
		const previousState = deepFreeze( {
			requesting: {
				[ primarySiteId ]: true,
			},
		} );

		test( 'should default to an empty object', () => {
			const state = reducer( undefined, {} );

			expect( state.requesting ).to.eql( {} );
		} );

		test( 'should set request to false if status have been received', () => {
			const state = reducer( previousState, {
				type: WP_SUPER_CACHE_RECEIVE_STATUS,
				siteId: primarySiteId,
			} );

			expect( state.requesting ).to.eql( {
				[ primarySiteId ]: false,
			} );
		} );

		test( 'should set request to true if request in progress', () => {
			const state = reducer( undefined, {
				type: WP_SUPER_CACHE_REQUEST_STATUS,
				siteId: primarySiteId,
			} );

			expect( state.requesting ).to.eql( {
				[ primarySiteId ]: true,
			} );
		} );

		test( 'should accumulate requesting values', () => {
			const state = reducer( previousState, {
				type: WP_SUPER_CACHE_REQUEST_STATUS,
				siteId: secondarySiteId,
			} );

			expect( state.requesting ).to.eql( {
				[ primarySiteId ]: true,
				[ secondarySiteId ]: true,
			} );
		} );

		test( 'should set request to false if request finishes with failure', () => {
			const state = reducer( previousState, {
				type: WP_SUPER_CACHE_REQUEST_STATUS_FAILURE,
				siteId: primarySiteId,
			} );

			expect( state.requesting ).to.eql( {
				[ primarySiteId ]: false,
			} );
		} );
	} );

	describe( 'items()', () => {
		const primaryNotices = {
			cache_writable: {
				message: '/home/public_html/ is writable.',
				type: 'warning',
			},
		};
		const secondaryNotices = {
			cache_readonly: {
				message: '/home/public_html/ is readonly.',
				type: 'warning',
			},
		};
		const previousState = deepFreeze( {
			items: {
				[ primarySiteId ]: primaryNotices,
			},
		} );

		test( 'should default to an empty object', () => {
			const state = reducer( undefined, {} );

			expect( state.items ).to.eql( {} );
		} );

		test( 'should index status by site ID', () => {
			const state = reducer( undefined, {
				type: WP_SUPER_CACHE_RECEIVE_STATUS,
				siteId: primarySiteId,
				status: primaryNotices,
			} );

			expect( state.items ).to.eql( {
				[ primarySiteId ]: primaryNotices,
			} );
		} );

		test( 'should accumulate status', () => {
			const state = reducer( previousState, {
				type: WP_SUPER_CACHE_RECEIVE_STATUS,
				siteId: secondarySiteId,
				status: secondaryNotices,
			} );

			expect( state.items ).to.eql( {
				[ primarySiteId ]: primaryNotices,
				[ secondarySiteId ]: secondaryNotices,
			} );
		} );

		test( 'should override previous status of same site ID', () => {
			const state = reducer( previousState, {
				type: WP_SUPER_CACHE_RECEIVE_STATUS,
				siteId: primarySiteId,
				status: secondaryNotices,
			} );

			expect( state.items ).to.eql( {
				[ primarySiteId ]: secondaryNotices,
			} );
		} );

		test( 'should accumulate new status and overwrite existing ones for the same site ID', () => {
			const newNotices = {
				cache_writable: {
					message: '/home/public_html/ is writable.',
					type: 'warning',
				},
				cache_readonly: {
					message: '/home/public_html/ is readonly.',
					type: 'warning',
				},
			};
			const state = reducer( previousState, {
				type: WP_SUPER_CACHE_RECEIVE_STATUS,
				siteId: primarySiteId,
				status: newNotices,
			} );

			expect( state.items ).to.eql( {
				[ primarySiteId ]: newNotices,
			} );
		} );

		test( 'should persist state', () => {
			const state = serialize( reducer, previousState );

			expect( state.root().items ).to.eql( {
				[ primarySiteId ]: primaryNotices,
			} );
		} );

		test( 'should load valid persisted state', () => {
			const state = deserialize( reducer, previousState );

			expect( state.items ).to.eql( {
				[ primarySiteId ]: primaryNotices,
			} );
		} );

		test( 'should not load invalid persisted state', () => {
			const previousInvalidState = deepFreeze( {
				items: {
					[ primarySiteId ]: 2,
				},
			} );
			const state = deserialize( reducer, previousInvalidState );

			expect( state.items ).to.eql( {} );
		} );
	} );
} );
