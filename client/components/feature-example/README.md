# Feature Example

Feature Example is a component used to render an mocked example of any feature. It renders whatever children it receives. The example is covered by a layer of fading gradient that gives the user a sense of UI that they are missing.

## Usage

```jsx
import React from 'react';
import EmptyContent from 'calypso/components/empty-content';
import FeatureExample from 'calypso/components/feature-example';

class MyComponent extends React.Component {
	render() {
		return (
			<FeatureExample>
				<EmptyContent />
			</FeatureExample>
		);
	}
}
```
