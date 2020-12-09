// MODULES //

import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import DataExplorer from '@isle-project/components/data-explorer';
import SessionContext from '@isle-project/session/context.js';
import Session from '@isle-project/session';
import LicenseBarrier from 'ev/containers/visible-barrier';


// MAIN //

const AdminDataExplorer = ( props ) => {
	const keys = Object.keys( props.data );
	const quantitative = props.quantitative || keys;
	const categorical = props.categorical || keys;
	const session = new Session({}, true );
	return (
		<div className="admin-outer-container" >
			<LicenseBarrier>
				<Button onClick={props.close} style={{ float: 'right' }} >
					<i className="fas fa-times"></i>
				</Button>
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
								height: '74vh'
							}}
						/>
					</div>
				</SessionContext.Provider>
			</LicenseBarrier>
		</div>
	);
};


// PROPERTIES //

AdminDataExplorer.propTypes = {
	categorical: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	quantitative: PropTypes.array.isRequired,
	title: PropTypes.string
};

AdminDataExplorer.defaultProps = {
	title: ''
};


// EXPORTS //

export default AdminDataExplorer;
