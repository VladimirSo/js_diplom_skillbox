// reducers
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import React from 'react';
import { Link } from 'react-router-dom';


const fotos = (
    state = {
        fotos: {
            isFetching: false,
            didInvalidate: false,
            fotosArr: [],
        },
        routing: routerReducer,
    },

    action) => {
    // debugger;
    // console.log(action);
    // console.log(state);

    switch (action.type) {
        case 'LOAD_FOTOS_REQUEST':
            // debugger;
            console.log('LOAD_FOTOS_REQUEST');
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
            });
        //
        // return state;
        case 'LOAD_FOTOS_FAILURE':
            console.log('LOAD_FOTOS_FAILURE');
            return Object.assign({}, state, {
                didInvalidate: true,
            });
        //
        // return state;
        case 'LOAD_FOTOS_SUCCESS':
            console.log('LOAD_FOTOS_SUCCESS');
            return Object.assign({}, state, {
                fotosArr: action.payload,
            });
        // return state;
        case 'VIEW_PHOTO':
            // debugger;
            let selectedPhoto = {};

            state.fotosArr.map((photo) => {
                if (photo.id === action.id) {
                    console.log(photo.urls.full);
                    selectedPhoto = {
                        id: photo.id,
                        altDescr: photo.alt_description,
                        userName: photo.user.name,
                        userLinks: photo.user.links.html,
                        updatedAt: photo.updated_at,
                        likes: photo.likes,
                        likedByUser: photo.liked_by_user,
                        // url: photo.urls.regular,
                        url: photo.urls.full,
                    };

                    <Link to='/view_photo_index'></Link>
                }
            });
            // console.log(selectedPhoto);
            return Object.assign({}, state, {
                viewedPhoto: selectedPhoto,
            });

        case 'TOKEN_REQUEST_MAKE':
            console.log('TOKEN_REQUEST_MAKE');
            return state;
        case 'TOKEN_REQUEST_FAIL':
            // debugger;
            console.log('TOKEN_REQUEST_FAIL: ' + action.error)
            return state;
        case 'TOKEN_REQUEST_SUCCESS':
            // debugger;
            console.log('TOKEN_REQUEST_SUCCESS: ' + action.payload);
            return Object.assign({}, state, {
                authToken: action.payload,
            });

        case 'TOGGLE_LIKE_SUCCESS':
            debugger;
            console.log('TOGGLE_LIKE_SUCCESS RUN: ' + action.statusOfLike);
            return state;
        case 'TOGGLE_LIKE_FAIL':
            debugger;
            console.log('TOGGLE_LIKE_FAIL: ' + action.error);
            return state;
        default:
            return state;
    }
}
//
// export default fotos;

export default combineReducers({
    fotos,
    routing: routerReducer,
});
