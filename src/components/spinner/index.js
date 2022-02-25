/**
* The MIT License (MIT)
*
* Copyright (c) 2015 Tobias Ahlin
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// MODULES //

import React from 'react';


// MAIN //

const Spinner = ({ className }) => {
	return ( <div className={`sk-cube-grid ${className}`} >
		<div className="sk-cube sk-cube1"></div>
		<div className="sk-cube sk-cube2"></div>
		<div className="sk-cube sk-cube3"></div>
		<div className="sk-cube sk-cube4"></div>
		<div className="sk-cube sk-cube5"></div>
		<div className="sk-cube sk-cube6"></div>
		<div className="sk-cube sk-cube7"></div>
		<div className="sk-cube sk-cube8"></div>
		<div className="sk-cube sk-cube9"></div>
	</div> );
};


// EXPORTS //

export default Spinner;
