import { Button } from '@automattic/components';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonGroup from 'calypso/components/button-group';
import Gridicon from 'calypso/components/gridicon';

const EditorRevisionsListNavigation = ( {
	nextIsDisabled,
	prevIsDisabled,
	selectNextRevision,
	selectPreviousRevision,
} ) => {
	return (
		<ButtonGroup className="editor-revisions-list__navigation">
			<Button
				compact
				className="editor-revisions-list__prev-button"
				type="button"
				onClick={ selectPreviousRevision }
				disabled={ prevIsDisabled }
			>
				<Gridicon icon="chevron-down" />
			</Button>
			<Button
				compact
				className="editor-revisions-list__next-button"
				type="button"
				onClick={ selectNextRevision }
				disabled={ nextIsDisabled }
			>
				<Gridicon icon="chevron-up" />
			</Button>
		</ButtonGroup>
	);
};

EditorRevisionsListNavigation.propTypes = {
	selectNextRevision: PropTypes.func.isRequired,
	selectPreviousRevision: PropTypes.func.isRequired,
	nextIsDisabled: PropTypes.bool,
	prevIsDisabled: PropTypes.bool,
};

export default EditorRevisionsListNavigation;
