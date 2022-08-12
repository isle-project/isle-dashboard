// MODULES //

import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';


// MAIN //

function HelpfulLabel({ name, description, colWidth, className, placement = 'left', disabled = false, as = Form.Label }) {
	const children = [ name ];
	if ( disabled ) {
		return React.createElement( as, { sm: colWidth, className: className, column: true }, children );
	}
	children.push( <i className="info-icon ms-2 fas fa-info"></i> );
	return (
		<OverlayTrigger placement={placement} overlay={<Tooltip id={`param-${name}-tooltip`}>{description}</Tooltip>} >
			{React.createElement( as, { sm: colWidth, className: className, column: true }, children )}
		</OverlayTrigger>
	);
}


// EXPORTS //

export default HelpfulLabel;
