// MODULES //

import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation, I18nextProvider } from 'react-i18next';
import { i18n } from '@isle-project/locales';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import DataExplorer from '@isle-project/components/data-explorer';
import SessionContext from '@isle-project/session/context.js';
import Session from '@isle-project/session';
import LicenseBarrier from 'ev/containers/visible-barrier';
import './data_explorer.css';


// MAIN //

const DashboardDataExplorer = ( props ) => {
	const keys = Object.keys( props.data );
	const quantitative = props.quantitative || keys;
	const categorical = props.categorical || keys;
	const session = new Session({}, true );
	return (
		<div className="explorer-outer-container" >
			<LicenseBarrier>
				<OverlayTrigger placement="left" overlay={<Tooltip id="explorerCloseButtonTooltip">
					{props.t('common:close')}
				</Tooltip>} >
					<Button onClick={props.close} style={{ float: 'right' }} >
						<i className="fas fa-times"></i>
					</Button>
				</OverlayTrigger>
				<I18nextProvider i18n={i18n} >
					<SessionContext.Provider value={session} >
						<div className="Lesson">
							<DataExplorer
								editor={false}
								data={props.data}
								dataInfo={{
									name: props.title
								}}
								quantitative={quantitative}
								categorical={categorical}
								style={{
									height: 'calc(100vh - 185px)'
								}}
							/>
						</div>
					</SessionContext.Provider>
				</I18nextProvider>
			</LicenseBarrier>
		</div>
	);
};


// PROPERTIES //

DashboardDataExplorer.propTypes = {
	categorical: PropTypes.array.isRequired,
	close: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	quantitative: PropTypes.array.isRequired,
	title: PropTypes.string
};

DashboardDataExplorer.defaultProps = {
	title: ''
};


// EXPORTS //

export default withTranslation( 'common' )( DashboardDataExplorer );
