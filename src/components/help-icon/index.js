import React                          from 'react';
import OverlayTrigger                 from 'react-bootstrap/OverlayTrigger';
import Popover                        from 'react-bootstrap/Popover';
import './help_icon.css';

const HelpIcon = (props) => {
    const overlayRef = React.useRef(null);

    return (
        <div className="help-panel" role="button" tabIndex={0} onKeyDown={(e) => overlayRef.current && (e.which === 13 || e.which === 32) && overlayRef.current.click(e)}>
            <OverlayTrigger
                placement="right"
                trigger={['click']}
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

export default HelpIcon;
