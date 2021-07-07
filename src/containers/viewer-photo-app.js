import React from 'react';
import { connect } from 'react-redux';

import ViewerPhoto from '../components/view-photo.js';
import { toggleLike, } from '../actions/actions.js';

let ViewerPhotoApp = (props) => {
    // debugger;
    const {
        rootReducer, toggleLike
    } = props;

    return (
        <div>
            <ViewerPhoto rootReducer={rootReducer} toggleLike={toggleLike} />
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
        toggleLike: (id, liked, token) => dispatch(toggleLike(id, liked, token)),
    }
}

ViewerPhotoApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewerPhotoApp);

export default ViewerPhotoApp;