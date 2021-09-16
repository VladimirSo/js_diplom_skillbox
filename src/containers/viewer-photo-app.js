import React from 'react';
import { connect } from 'react-redux';

import ViewerPhoto from '../components/view-photo.js';
import { toggleLike, getLikesInfo, } from '../actions/actions.js';

let ViewerPhotoApp = (props) => {
    // debugger;
    const {
        rootReducer, toggleLike, getLikesInfo
    } = props;

    return (
        <div>
            <ViewerPhoto rootReducer={rootReducer} toggleLike={toggleLike} getLikesInfo={getLikesInfo} />
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
        getLikesInfo: (id, token) => dispatch(getLikesInfo(id, token)),
    }
}

ViewerPhotoApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewerPhotoApp);

export default ViewerPhotoApp;