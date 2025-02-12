/**
 * External dependencies
 */
import { useRef } from 'react';
import type { StoreConfig } from '@wordpress/data';
import type { DomainContactDetails } from '@automattic/shopping-cart';
import type {
	PossiblyCompleteDomainContactDetails,
	WpcomStoreState,
	ManagedContactDetails,
	ManagedContactDetailsErrors,
	ManagedContactDetailsRequiredMask,
} from '@automattic/wpcom-checkout';

/**
 * Internal dependencies
 */
import {
	getInitialWpcomStoreState,
	managedContactDetailsUpdaters as updaters,
} from '../types/wpcom-store-state';

type WpcomStoreAction =
	| {
			type: 'APPLY_DOMAIN_CONTACT_VALIDATION_RESULTS';
			payload: ManagedContactDetailsErrors;
	  }
	| { type: 'UPDATE_DOMAIN_CONTACT_FIELDS'; payload: DomainContactDetails }
	| { type: 'SET_SITE_ID'; payload: string }
	| { type: 'SET_SITE_SLUG'; payload: string }
	| { type: 'SET_RECAPTCHA_CLIENT_ID'; payload: number }
	| { type: 'UPDATE_VAT_ID'; payload: string }
	| { type: 'UPDATE_EMAIL'; payload: string }
	| { type: 'UPDATE_PHONE'; payload: string }
	| { type: 'UPDATE_PHONE_NUMBER_COUNTRY'; payload: string }
	| { type: 'UPDATE_POSTAL_CODE'; payload: string }
	| { type: 'UPDATE_REQUIRED_DOMAIN_FIELDS'; payload: ManagedContactDetailsRequiredMask }
	| { type: 'TOUCH_CONTACT_DETAILS' }
	| { type: 'CLEAR_DOMAIN_CONTACT_ERROR_MESSAGES' }
	| { type: 'UPDATE_COUNTRY_CODE'; payload: string }
	| { type: 'LOAD_COUNTRY_CODE_FROM_GEOIP'; payload: string }
	| {
			type: 'LOAD_DOMAIN_CONTACT_DETAILS_FROM_CACHE';
			payload: PossiblyCompleteDomainContactDetails;
	  };

export function useWpcomStore(
	registerStore: < T >( key: string, storeOptions: StoreConfig< T > ) => void, // FIXME: this actually returns Store but will fail TS checks until we include https://github.com/DefinitelyTyped/DefinitelyTyped/pull/46969
	managedContactDetails: ManagedContactDetails,
	updateContactDetailsCache: ( _: DomainContactDetails ) => void
): void {
	// Only register once
	const registerIsComplete = useRef< boolean >( false );
	if ( registerIsComplete.current ) {
		return;
	}
	registerIsComplete.current = true;

	function contactReducer(
		state: ManagedContactDetails,
		action: WpcomStoreAction
	): ManagedContactDetails {
		switch ( action.type ) {
			case 'UPDATE_DOMAIN_CONTACT_FIELDS': {
				updateContactDetailsCache( action.payload );
				return updaters.updateDomainContactFields( state, action.payload );
			}
			case 'UPDATE_VAT_ID':
				return updaters.updateVatId( state, action.payload );
			case 'UPDATE_PHONE':
				return updaters.updatePhone( state, action.payload );
			case 'UPDATE_PHONE_NUMBER_COUNTRY':
				return updaters.updatePhoneNumberCountry( state, action.payload );
			case 'UPDATE_POSTAL_CODE':
				return updaters.updatePostalCode( state, action.payload );
			case 'UPDATE_REQUIRED_DOMAIN_FIELDS':
				return updaters.updateRequiredDomainFields( state, action.payload );
			case 'UPDATE_EMAIL':
				return updaters.updateEmail( state, action.payload );
			case 'UPDATE_COUNTRY_CODE':
				return updaters.updateCountryCode( state, action.payload );
			case 'APPLY_DOMAIN_CONTACT_VALIDATION_RESULTS':
				return updaters.setErrorMessages( state, action.payload );
			case 'CLEAR_DOMAIN_CONTACT_ERROR_MESSAGES':
				return updaters.clearErrorMessages( state );
			case 'TOUCH_CONTACT_DETAILS':
				return updaters.touchContactFields( state );
			case 'LOAD_COUNTRY_CODE_FROM_GEOIP':
				return updaters.populateCountryCodeFromGeoIP( state, action.payload );
			case 'LOAD_DOMAIN_CONTACT_DETAILS_FROM_CACHE':
				return updaters.populateDomainFieldsFromCache( state, action.payload );
			default:
				return state;
		}
	}

	function siteIdReducer( state: string, action: WpcomStoreAction ): string {
		switch ( action.type ) {
			case 'SET_SITE_ID':
				return action.payload;
			default:
				return state;
		}
	}

	function siteSlugReducer( state: string, action: WpcomStoreAction ): string {
		switch ( action.type ) {
			case 'SET_SITE_SLUG':
				return action.payload;
			default:
				return state;
		}
	}

	function recaptchaClientIdReducer( state: number, action: WpcomStoreAction ): number {
		switch ( action.type ) {
			case 'SET_RECAPTCHA_CLIENT_ID':
				return action.payload;
			default:
				return state;
		}
	}

	registerStore( 'wpcom', {
		reducer( state: WpcomStoreState | undefined, action: WpcomStoreAction ): WpcomStoreState {
			const checkedState =
				state === undefined ? getInitialWpcomStoreState( managedContactDetails ) : state;
			return {
				contactDetails: contactReducer( checkedState.contactDetails, action ),
				siteId: siteIdReducer( checkedState.siteId, action ),
				siteSlug: siteSlugReducer( checkedState.siteSlug, action ),
				recaptchaClientId: recaptchaClientIdReducer( checkedState.recaptchaClientId, action ),
			};
		},

		actions: {
			applyDomainContactValidationResults(
				payload: ManagedContactDetailsErrors
			): WpcomStoreAction {
				return { type: 'APPLY_DOMAIN_CONTACT_VALIDATION_RESULTS', payload };
			},

			clearDomainContactErrorMessages(): WpcomStoreAction {
				return { type: 'CLEAR_DOMAIN_CONTACT_ERROR_MESSAGES' };
			},

			setSiteId( payload: string ): WpcomStoreAction {
				return { type: 'SET_SITE_ID', payload };
			},

			setSiteSlug( payload: string ): WpcomStoreAction {
				return { type: 'SET_SITE_SLUG', payload };
			},

			setRecaptchaClientId( payload: number ): WpcomStoreAction {
				return { type: 'SET_RECAPTCHA_CLIENT_ID', payload };
			},

			updateDomainContactFields( payload: DomainContactDetails ): WpcomStoreAction {
				return { type: 'UPDATE_DOMAIN_CONTACT_FIELDS', payload };
			},

			updatePhone( payload: string ): WpcomStoreAction {
				return { type: 'UPDATE_PHONE', payload };
			},

			updatePhoneNumberCountry( payload: string ): WpcomStoreAction {
				return { type: 'UPDATE_PHONE_NUMBER_COUNTRY', payload };
			},

			updatePostalCode( payload: string ): WpcomStoreAction {
				return { type: 'UPDATE_POSTAL_CODE', payload };
			},

			updateRequiredDomainFields( payload: ManagedContactDetailsRequiredMask ): WpcomStoreAction {
				return { type: 'UPDATE_REQUIRED_DOMAIN_FIELDS', payload };
			},

			updateEmail( payload: string ): WpcomStoreAction {
				return { type: 'UPDATE_EMAIL', payload };
			},

			updateCountryCode( payload: string ): WpcomStoreAction {
				return { type: 'UPDATE_COUNTRY_CODE', payload };
			},

			touchContactFields(): WpcomStoreAction {
				return { type: 'TOUCH_CONTACT_DETAILS' };
			},

			updateVatId( payload: string ): WpcomStoreAction {
				return { type: 'UPDATE_VAT_ID', payload: payload };
			},

			loadCountryCodeFromGeoIP( payload: string ): WpcomStoreAction {
				return { type: 'LOAD_COUNTRY_CODE_FROM_GEOIP', payload };
			},

			loadDomainContactDetailsFromCache(
				payload: PossiblyCompleteDomainContactDetails
			): WpcomStoreAction {
				return { type: 'LOAD_DOMAIN_CONTACT_DETAILS_FROM_CACHE', payload };
			},
		},

		selectors: {
			getSiteId( state: WpcomStoreState ): string {
				return state.siteId;
			},

			getSiteSlug( state: WpcomStoreState ): string {
				return state.siteSlug;
			},

			getContactInfo( state: WpcomStoreState ): ManagedContactDetails {
				return state.contactDetails;
			},

			getRecaptchaClientId( state: WpcomStoreState ): number {
				return state.recaptchaClientId;
			},
		},
	} );
}
