import { Card } from '@automattic/components';
import { ToggleControl } from '@wordpress/components';
import { pick } from 'lodash';
import React from 'react';
import ExternalLink from 'calypso/components/external-link';
import FormFieldset from 'calypso/components/forms/form-fieldset';
import Notice from 'calypso/components/notice';
import SectionHeader from 'calypso/components/section-header';
import WrapSettingsForm from '../wrap-settings-form';

const Miscellaneous = ( {
	fields: {
		cache_compression,
		cache_hello_world,
		cache_mod_rewrite,
		cache_rebuild,
		dont_cache_logged_in,
		make_known_anon,
		no_cache_for_get,
		use_304_headers,
	},
	handleAutosavingToggle,
	isReadOnly,
	isRequesting,
	isSaving,
	status: {
		compression_disabled_by_admin: compressionDisabledByAdmin,
		compression_disabled_no_gzencode: compressionDisabledNoGzEncode,
	},
	translate,
} ) => {
	const isDisabled = isRequesting || isSaving || isReadOnly;
	let compressionDisabledMessage;

	if ( compressionDisabledByAdmin ) {
		compressionDisabledMessage = translate( 'Compression disabled by a site administrator.' );
	} else if ( compressionDisabledNoGzEncode ) {
		compressionDisabledMessage = translate(
			'Warning! Compression is disabled as gzencode() function was not found.'
		);
	}

	return (
		<div>
			<SectionHeader label={ translate( 'Miscellaneous' ) } />
			<Card>
				<form>
					{ compressionDisabledMessage && (
						<Notice showDismiss={ false } status="is-warning" text={ compressionDisabledMessage } />
					) }
					<FormFieldset>
						{ ! compressionDisabledMessage && (
							<ToggleControl
								checked={ !! cache_compression }
								disabled={ isDisabled }
								onChange={ handleAutosavingToggle( 'cache_compression' ) }
								label={
									<span>
										{ translate(
											'Compress pages so they’re served more quickly to visitors. {{em}}(Recommended{{/em}})',
											{
												components: { em: <em /> },
											}
										) }
									</span>
								}
							/>
						) }
						{ ! compressionDisabledMessage && (
							<Notice
								isCompact
								className="wp-super-cache__toggle-notice"
								text={ translate(
									'Compression is disabled by default because some hosts have problems ' +
										'with compressed files. Switching it on and off clears the cache.'
								) }
							/>
						) }

						<ToggleControl
							checked={ !! dont_cache_logged_in }
							disabled={ isDisabled }
							onChange={ handleAutosavingToggle( 'dont_cache_logged_in' ) }
							label={
								<span>
									{ translate( 'Don’t cache pages for known users. {{em}}(Recommended){{/em}}', {
										components: { em: <em /> },
									} ) }
								</span>
							}
						/>

						<ToggleControl
							checked={ !! cache_rebuild }
							disabled={ isDisabled }
							onChange={ handleAutosavingToggle( 'cache_rebuild' ) }
							label={
								<span>
									{ translate(
										'Cache rebuild. Serve a supercache file to anonymous users while a new ' +
											'file is being generated. {{em}}(Recommended){{/em}}',
										{
											components: { em: <em /> },
										}
									) }
								</span>
							}
						/>

						<ToggleControl
							checked={ !! use_304_headers }
							disabled={ isDisabled || !! cache_mod_rewrite }
							onChange={ handleAutosavingToggle( 'use_304_headers' ) }
							label={
								<span>
									{ translate(
										'304 Not Modified browser caching. Indicate when a page has not been ' +
											'modified since it was last requested. {{em}}(Recommended){{/em}}',
										{
											components: { em: <em /> },
										}
									) }
								</span>
							}
						/>

						{ cache_mod_rewrite && (
							<Notice
								isCompact
								className="wp-super-cache__toggle-notice"
								status="is-warning"
								text={ translate(
									'304 browser caching is only supported when mod_rewrite caching ' + 'is not used.'
								) }
							/>
						) }

						{ ! cache_mod_rewrite && (
							<Notice
								isCompact
								className="wp-super-cache__toggle-notice"
								text={ translate(
									'304 support is disabled by default because some hosts have had problems with the ' +
										'headers used in the past.'
								) }
							/>
						) }

						<ToggleControl
							checked={ !! no_cache_for_get }
							disabled={ isDisabled }
							onChange={ handleAutosavingToggle( 'no_cache_for_get' ) }
							label={
								<span>
									{ translate(
										'Don’t cache pages with GET parameters. (?x=y at the end of a url)'
									) }
								</span>
							}
						/>

						<ToggleControl
							checked={ !! make_known_anon }
							disabled={ isDisabled }
							onChange={ handleAutosavingToggle( 'make_known_anon' ) }
							label={
								<span>
									{ translate(
										'Make known users anonymous so they’re served supercached static files.'
									) }
								</span>
							}
						/>

						<ToggleControl
							checked={ !! cache_hello_world }
							disabled={ isDisabled }
							onChange={ handleAutosavingToggle( 'cache_hello_world' ) }
							label={
								<span>
									{ translate(
										'Proudly tell the world your server is {{fry}}Stephen Fry proof{{/fry}}! ' +
											'(places a message in your blog’s footer)',
										{
											components: {
												fry: (
													<ExternalLink
														icon={ true }
														target="_blank"
														href="https://twitter.com/#!/HibbsLupusTrust/statuses/136429993059291136"
													/>
												),
											},
										}
									) }
								</span>
							}
						/>
					</FormFieldset>
				</form>
			</Card>
		</div>
	);
};

const getFormSettings = ( settings ) => {
	return pick( settings, [
		'cache_compression',
		'cache_hello_world',
		'cache_mod_rewrite',
		'cache_rebuild',
		'dont_cache_logged_in',
		'make_known_anon',
		'no_cache_for_get',
		'use_304_headers',
	] );
};

export default WrapSettingsForm( getFormSettings )( Miscellaneous );
