import React from 'react';
import { requestAuth } from '../actions/actions.js';

let AuthenApp = (props) => {
    // debugger;
    console.log('REQUEST SENT TO');

    if (localStorage.fotoViewerAuthToken === undefined) {
        requestAuth();
    };

    return (
        <div>
            <p>Авторизация...</p>
        </div>
    )
}

export default AuthenApp;