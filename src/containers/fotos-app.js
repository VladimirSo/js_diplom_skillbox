import React from 'react';
import { connect } from 'react-redux';

import FotosList from '../components/fotos.js';
import { viewPhoto, } from '../actions/actions.js';
import { loadFotos, requestAuthToken } from '../actions/actions.js';

let App = (props) => {
    // debugger;
    const {
        rootReducer, loadFotos, requestAuthToken, viewPhoto,
    } = props;

    const fotosArr = rootReducer.fotos.fotosArr;

    document.addEventListener('DOMContentLoaded', () => {
        // debugger;
        if (sessionStorage.fotoViewerSentRequest === 'true') {
            // console.log(location.search);
            const authorizationCode = location.search.split('code=')[1];
            console.log('AuthCode: ' + authorizationCode);

            sessionStorage.setItem('fotoViewerSentRequest', 'false');
            requestAuthToken(authorizationCode);
        };

        if (fotosArr.length === 0) {
            loadFotos();
        };
    });
    // document.addEventListener('scroll', () => {
    //     alert('mouse move');
    // })

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
        requestAuthToken: (code) => dispatch(requestAuthToken(code)),
    }
}

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;