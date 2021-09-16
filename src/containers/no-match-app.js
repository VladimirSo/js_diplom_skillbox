import React from 'react';

import '../scss/404.scss';

let NoMatchApp = (props) => {
    console.log('404 - something is wrong');

    return (
        <div className="no-match-page">
            <div className="no-match-container">
                <h3 className="no-match-page__title">404 - Что-то пошло не так...</h3>
            </div>
        </div>
    )
}

export default NoMatchApp;