import { select } from '@wordpress/data';
import debug from 'debug';
import { omitBy } from 'lodash';
import { isE2ETest } from '../../../utils';
import { getEditorType } from '../utils';

const tracksDebug = debug( 'wpcom-block-editor:analytics:tracks' );
const e2ETracksDebug = debug( 'wpcom-block-editor:e2e' );

// In case Tracks hasn't loaded.
if ( typeof window !== 'undefined' ) {
	window._tkq = window._tkq || [];
}

// Enable a events stack for e2e testing purposes
// on e2e test environments only.
// see https://github.com/Automattic/wp-calypso/pull/41329.
const E2E_STACK_SIZE = 100;
if ( isE2ETest() ) {
	e2ETracksDebug( 'E2E env' );
	window._e2eEventsStack = [];
}

// Adapted from the analytics lib :(
// Because this is happening outside of the Calypso app we can't reuse the same lib
// This means we don't have any extra props like user

export default ( eventName, eventProperties ) => {
	/*
	 * Required Properties.
	 * Required by Tracks when added manually.
	 */
	const requiredProperties = {
		blog_id: window._currentSiteId,
		site_type: window._currentSiteType,
		user_locale: window._currentUserLocale,
	};

	/**
	 * Custom Properties we add to each event by default.
	 * - `editor_type` is used to indicate in which editor the event occurs.
	 * - `post_type` is used to indicate what kind of entity is being edited when the event occurs.
	 *   We only do this in `post` editor, because it doesn't make sense in `site` editor.
	 */
	const editorType = getEditorType();
	const postType = editorType === 'post' ? select( 'core/editor' ).getCurrentPostType() : undefined;
	const customProperties = {
		editor_type: editorType,
		post_type: postType,
	};

	eventProperties = eventProperties || {};

	if ( process.env.NODE_ENV !== 'production' && typeof console !== 'undefined' ) {
		for ( const key in eventProperties ) {
			if ( eventProperties[ key ] !== null && typeof eventProperties[ key ] === 'object' ) {
				const errorMessage =
					`Tracks: Unable to record event "${ eventName }" because nested ` +
					`properties are not supported by Tracks. Check '${ key }' on`;
				console.error( errorMessage, eventProperties ); //eslint-disable-line no-console
				return;
			}

			if ( ! /^[a-z_][a-z0-9_]*$/.test( key ) ) {
				//eslint-disable-next-line no-console
				console.error(
					'Tracks: Event `%s` will be rejected because property name `%s` does not match /^[a-z_][a-z0-9_]*$/. ' +
						'Please use a compliant property name.',
					eventName,
					key
				);
			}
		}
	}

	// Populate custom properties. We want to remove undefined values
	// so we populate these separately from `requiredProperties`.
	// We also want to allow these to be overriden by given `eventProperties`.
	eventProperties = { ...customProperties, ...eventProperties };

	// Remove properties that have an undefined value
	// This allows a caller to easily remove properties from the recorded set by setting them to undefined
	eventProperties = omitBy( eventProperties, ( prop ) => typeof prop === 'undefined' );

	// Populate required properties.
	eventProperties = { ...eventProperties, ...requiredProperties };

	tracksDebug( 'Recording event %o with actual props %o', eventName, eventProperties );

	const record = [ 'recordEvent', eventName, eventProperties ];

	if ( isE2ETest() ) {
		e2ETracksDebug(
			'pushing %s event to E2E stack - current size: %o',
			record[ 0 ],
			window._e2eEventsStack.length
		);
		// Add the record at the beginning of the stack.
		window._e2eEventsStack.unshift( record );

		// Apply FIFO behaviour to E2E stack.
		if ( window._e2eEventsStack.length > E2E_STACK_SIZE ) {
			// Remove the last item.
			const removeRecord = window._e2eEventsStack.pop();
			e2ETracksDebug( 'removing %s last event from E2E stack', removeRecord[ 0 ] );
		}
	}

	window._tkq.push( record );
};
