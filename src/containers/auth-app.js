import React from 'react';
import { requestAuth } from '../actions/actions.js';

import '../scss/auth.scss';

let AuthenApp = (props) => {
    console.log('REQUEST SENT TO');

    if (sessionStorage.fotoViewerAuthToken === undefined) {
        // debugger;
        requestAuth();
    };

    return (
        <div className="auth">
            <div className="auth-container">
                <p className="auth__desc">Авторизация на Unsplash...</p>
                <svg className="auth__spinner" viewBox="0 0 50 50">
                    <circle className="orbit" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
            </div>
        </div>
    )
}

export default AuthenApp;