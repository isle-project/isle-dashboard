// MODULES //

import Button from 'react-bootstrap/Button';
import DataExplorer from '@isle-project/components/data-explorer';
import SessionContext from '@isle-project/session/context.js';
import Session from '@isle-project/session';
import LicenseBarrier from 'ev/components/admin/barrier';


// MAIN //

const AdminDataExplorer = ( props ) => {
	const keys = Object.keys( props.data );
	const quantitative = props.quantitative || keys;
	const categorical = props.categorical || keys;
	const session = new Session({}, true );
	return (
		<div className="admin-outer-container" >
			<LicenseBarrier admin={props.admin} >
				<h2>
					{props.title}
					<Button onClick={props.close} style={{ float: 'right' }} >Cancel</Button>
				</h2>
				<SessionContext.Provider value={session} >
					<div className="Lesson">
						<DataExplorer
							editor={false}
							data={props.data}
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


// EXPORTS //

export default AdminDataExplorer;
