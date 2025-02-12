/**
 * Internal dependencies
 */
import { SUPPORT_SESSION_TRANSITION } from 'calypso/state/action-types';
import { SESSION_ACTIVE, SESSION_EXPIRED } from './constants';

import 'calypso/state/support/init';

export function supportSessionActivate() {
	return {
		type: SUPPORT_SESSION_TRANSITION,
		nextState: SESSION_ACTIVE,
	};
}

export function supportSessionExpire() {
	return {
		type: SUPPORT_SESSION_TRANSITION,
		nextState: SESSION_EXPIRED,
	};
}
