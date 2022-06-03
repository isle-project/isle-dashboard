/**
* Copyright (C) 2016-present The ISLE Authors
*
* The isle-dashboard program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// MODULES //

import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import './help_icon.css';


// MAIN //

const HelpIcon = ( props ) => {
	const overlayRef = React.useRef( null );
	return (
		<div className="help-panel" role="button" tabIndex={0} onKeyDown={(e) => overlayRef.current && (e.which === 13 || e.which === 32) && overlayRef.current.click(e)}>
			<OverlayTrigger
				placement="right"
				trigger={[ 'click' ]}
				rootClose={true}
				delay={{ show: 250, hide: 0 }}
				overlay={ps => <Popover {...ps} className='help-text'><Popover.Body>{props.children}</Popover.Body></Popover>}
			>
				<span className="mr-1" tabIndex="0" role="button" ref={overlayRef}>
					info
				</span>
			</OverlayTrigger>
		</div>
	);
};


// EXPORTS //

export default HelpIcon;
