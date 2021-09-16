import React from 'react';
import { connect } from 'react-redux';

import FotosList from '../components/list-fotos.js';
import { viewPhoto, } from '../actions/actions.js';
import { loadFotos, requestAuthToken } from '../actions/actions.js';

let App = (props) => {
    // debugger;
    const {
        rootReducer, loadFotos, requestAuthToken, viewPhoto
    } = props;

    const fotosArr = rootReducer.fotos.fotosArr;

    window.onload = () => {
        // debugger;
        if (sessionStorage.fotoViewerSentRequest === 'true') {
            const authorizationCode = location.search.split('code=')[1];
            console.log('AuthCode: ' + authorizationCode);

            sessionStorage.setItem('fotoViewerSentRequest', 'false');
            requestAuthToken(authorizationCode);
        };

        if (fotosArr.length === 0) {
            loadFotos();
        };
    }

    window.onbeforeunload = () => {
        localStorage.removeItem('fotoViewerAuthToken')
    }

    /// отслеживание скролла
    const catchScroll = () => {
        console.log('Catch end of scroll');
        loadFotos();
    }
    window.onscroll = () => {
        const checkedElem = document.querySelector('.checked-elem');
        const fetchFotos = rootReducer.fotos.isFetching;
        // debugger;
        if (checkedElem) {
            if ((checkedElem.getBoundingClientRect().bottom - 1) < document.documentElement.clientHeight && (fetchFotos != true)) {
                window.addEventListener('scroll', catchScroll, { once: true });
            }
        }
    };

    return (
        <div>
            <FotosList rootReducer={rootReducer} viewPhoto={viewPhoto} loadFotos={loadFotos} requestAuthToken={requestAuthToken} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        rootReducer: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        viewPhoto: (id) => dispatch(viewPhoto(id)),
        loadFotos: () => dispatch(loadFotos()),
        getLikedFotos: () => dispatch(getLikedFotos()),
        requestAuthToken: (code) => dispatch(requestAuthToken(code)),
    }
}

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;