import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import FotosList from '../components/list-fotos.js';
import { viewPhoto, getLikesInfo } from '../actions/actions.js';
import { loadFotos, requestAuthToken } from '../actions/actions.js';

let App = (props) => {
    // debugger;
    const {
        rootReducer, loadFotos, requestAuthToken, viewPhoto, getLikesInfo
    } = props;

    // const fotosArr = rootReducer.fotos.fotosArr;
    useEffect(() => {
        // debugger;
        if (sessionStorage.fotoViewerSentRequest === 'true') {
            const authorizationCode = location.search.split('code=')[1];
            console.log('AuthCode: ' + authorizationCode);

            sessionStorage.setItem('fotoViewerSentRequest', 'false');
            requestAuthToken(authorizationCode);
        };

        console.log("First Load of Fotos");
        loadFotos();
    }, [])

    /// отслеживание скролла
    const ref = useRef(null);
    const checkedElemRef = ref.current;

    const catchScroll = () => {
        console.log('Catch end of scroll');
        loadFotos();
    }
    window.onscroll = () => {
        // debugger;
        // const checkedElem = document.querySelector('.checked-elem');
        // console.log(checkElRef.target);
        const checkedElem = checkedElemRef.target;
        const fetchFotos = rootReducer.fotos.isFetching;

        if (checkedElem) {
            if ((checkedElem.getBoundingClientRect().bottom - 1) < document.documentElement.clientHeight && (fetchFotos != true)) {
                window.addEventListener('scroll', catchScroll, { once: true });
            }
        }
    };

    return (
        <div>
            <FotosList ref={ref} rootReducer={rootReducer} viewPhoto={viewPhoto} loadFotos={loadFotos} requestAuthToken={requestAuthToken} getLikesInfo={getLikesInfo} />
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        rootReducer: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        viewPhoto: (id) => dispatch(viewPhoto(id)),
        loadFotos: () => dispatch(loadFotos()),
        getLikesInfo: (id, code) => dispatch(getLikesInfo(id, code)),
        requestAuthToken: (code) => dispatch(requestAuthToken(code)),
    }
}

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;