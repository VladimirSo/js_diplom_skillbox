///
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { routerReducer } from 'react-router-redux';

import FotosApp from './containers/list-fotos-app.js';
import ViewerPhotoApp from './containers/viewer-photo-app.js';
import AuthenApp from './containers/auth-app.js';
import NoMatchApp from './containers/no-match-app.js';

import rootReducer from './reducers/index.js';

import './css/main.css';
import './scss/fonts.scss';
import './scss/main.scss';

// debugger;
const initialState = {
    fotos: {
        isFetching: true,
        didInvalidate: false,
        fotosArr: [],
        viewedPhoto: { id: "no_photo" },
        authToken: (localStorage.fotoViewerAuthToken !== undefined) ? localStorage.fotoViewerAuthToken : '',
    },
    routing: routerReducer,
}

///* для разработки: начальный state c примером массива данных с unsplash
// const initialState = {
//     isFetching: true,
//     didInvalidate: false,
//     fotosArr: [
//         {
//             id: '0001',
//             updated_at: '2021-06-16T11:06:03-04:00',
//             alt_description: 'Example Photo 1',
//             user: {
//                 name: 'Example Autor 1',
//                 links: {
//                     html: 'https://unsplash.com/@madesolobymariah',
//                 }
//             },
//             urls: {
//                 small: 'https://images.unsplash.com/photo-1623784307671-fba0d4643d01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE2MjM4NTk4MjM&ixlib=rb-1.2.1&q=80&w=400',
//                 regular: 'https://images.unsplash.com/photo-1623784307671-fba0d4643d01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE2MjM4NTk4MjM&ixlib=rb-1.2.1&q=80&w=1080',
//                 full: 'https://images.unsplash.com/photo-1623784307671-fba0d4643d01?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHwxMHx8fHx8fDJ8fDE2MjM4NTk4MjM&ixlib=rb-1.2.1&q=85',
//             },
//             likes: 4,
//             liked_by_user: false,
//         },
//         {
//             id: '0002',
//             updated_at: '2021-06-16T11:09:04-04:00',
//             alt_description: 'Example Photo 2',
//             user: {
//                 name: 'Example Autor 2',
//                 links: {
//                     html: 'https://unsplash.com/@matthaide',
//                 }
//             },
//             urls: {
//                 small: 'https://images.unsplash.com/photo-1623782729858-397f66711699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHw5fHx8fHx8Mnx8MTYyMzg1OTgyMw&ixlib=rb-1.2.1&q=80&w=400',
//                 regular: 'https://images.unsplash.com/photo-1623782729858-397f66711699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHw5fHx8fHx8Mnx8MTYyMzg1OTgyMw&ixlib=rb-1.2.1&q=80&w=1080',
//                 full: 'https://images.unsplash.com/photo-1623782729858-397f66711699?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHw5fHx8fHx8Mnx8MTYyMzg1OTgyMw&ixlib=rb-1.2.1&q=85',
//             },
//             likes: 5,
//             liked_by_user: false,
//         },
//         {
//             id: '0003',
//             updated_at: '2021-06-16T11:12:04-04:00',
//             alt_description: 'Example Photo 3',
//             user: {
//                 name: 'Example Autor 3',
//                 links: {
//                     html: 'https://unsplash.com/@fbartels',
//                 }
//             },
//             urls: {
//                 small: 'https://images.unsplash.com/photo-1623790267168-9fe573a5f866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHw4fHx8fHx8Mnx8MTYyMzg1OTgyMw&ixlib=rb-1.2.1&q=80&w=400',
//                 regular: 'https://images.unsplash.com/photo-1623790267168-9fe573a5f866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHw4fHx8fHx8Mnx8MTYyMzg1OTgyMw&ixlib=rb-1.2.1&q=80&w=1080',
//                 full: 'https://images.unsplash.com/photo-1623790267168-9fe573a5f866?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMzY2NDJ8MHwxfGFsbHw4fHx8fHx8Mnx8MTYyMzg1OTgyMw&ixlib=rb-1.2.1&q=85',
//             },
//             likes: 7,
//             liked_by_user: true,
//         },
//     ]
// }

///* Без react-router: */
// const store = createStore(fotos, initialState, applyMiddleware(thunk));

// ReactDOM.render(
//     <FotosApp store={store} />,
//     document.querySelector('.fotos-viewer-app')
// );

/// если в localStorage нет токена с unsplash или если запрос на авторизацию еще не послан, то нужна авторизаця
const auth = ((localStorage.fotoViewerAuthToken === undefined) && (sessionStorage.fotoViewerSentRequest != 'true')) ? true : false;
///
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer, initialState);

let App = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={FotosApp}>
                        {auth ? (
                            <Redirect to="/auth" />
                        ) : (
                            <FotosApp />
                        )}
                    </Route>
                    <Route path="/view_photo_index" exact component={ViewerPhotoApp} />
                    <Route path="/auth" exact component={AuthenApp} />
                    <Route path="*" component={NoMatchApp} />
                </Switch>
            </div>
        </BrowserRouter >
    );
};

ReactDOM.render(
    <Provider store={store}>
        <App store={store} />
    </Provider >,
    document.querySelector('.fotos-viewer-app')
)