// reducers
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

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
            // debugger;
            console.log('LOAD_FOTOS_SUCCESS: ', action.payload);
            let newArr = state.fotosArr.concat(action.payload);

            return Object.assign({}, state, {
                fotosArr: newArr,
                isFetching: false,
            });
        //
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
                        createdAt: photo.created_at,
                        likes: photo.likes,
                        likedByUser: photo.liked_by_user,
                        url: photo.urls.full,
                        width: photo.width,
                        height: photo.height,
                    };
                    sessionStorage.setItem('fotoViewerViewedPhoto', JSON.stringify(selectedPhoto));
                }
            });

            return Object.assign({}, state, {
                viewedPhoto: selectedPhoto,
            });
        case 'GET_PHOTO_INFO':
            // debugger;
            console.log('PHOTO_INFO_SUCCESS: ', action.payload);
            let likedPhoto = state.viewedPhoto;

            if (action.payload.liked_by_user === true) {
                likedPhoto.likedByUser = true;
            }

            return Object.assign({}, state, {
                viewedPhoto: likedPhoto,
            });
        // 
        // return state
        case 'GET_PHOTO_INFO_ERROR':
            console.log('PHOTO_INFO_ERROR: ', action.er);
            return state;

        case 'TOKEN_REQUEST_MAKE':
            console.log('TOKEN_REQUEST_MAKE');
            return state;
        case 'TOKEN_REQUEST_FAIL':
            console.log('TOKEN_REQUEST_FAIL: ', action.error)
            return state;
        case 'TOKEN_REQUEST_SUCCESS':
            console.log('TOKEN_REQUEST_SUCCESS: ', action.payload);
            return Object.assign({}, state, {
                authToken: action.payload,
            });

        case 'TOGGLE_LIKE_SUCCESS':
            // debugger;
            console.log('TOGGLE_LIKE_SUCCESS: ', action.likedPhoto);

            let photo = state.viewedPhoto;
            photo.likedByUser = action.likedPhoto.liked_by_user;
            photo.likes = action.likedPhoto.likes;

            let fotos = state.fotosArr;
            fotos.map((foto) => {
                if (foto.id === action.likedPhoto.id) {
                    foto.likes = action.likedPhoto.likes;
                    foto.liked_by_user = action.likedPhoto.liked_by_user;
                }
            });

            return Object.assign({}, state, {
                viewedPhoto: photo,
                fotosArr: fotos,
            });
        //
        // return state;
        case 'TOGGLE_LIKE_FAIL':
            // debugger;
            console.log('TOGGLE_LIKE_FAIL: ', action.error);
            return state;
        // case 'GET_LIKED_FOTOS_MAKE':
        //     console.log('GET_LIKED_FOTOS_MAKE');
        //     return state;
        // case 'GET_LIKED_FOTOS_SUCCESS':
        //     // debugger;
        //     console.log('GET_LIKED_FOTOS_SUCCESS: ', action.payload);
        //     return state;
        // case 'GET_LIKED_FOTOS_FAILURE':
        //     console.log('GET_LIKED_FOTOS_FAILURE: ', action.error);
        //     return state;
        default:
            return state;
    }
}

// export default fotos;
export default combineReducers({
    fotos,
    routing: routerReducer,
});
