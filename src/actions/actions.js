import { createApi } from 'unsplash-js';
//
const MY_ACCESS_KEY = 'GfrfHdu7zljXSCIAGzglYINpnQJ7tMSgWG2xnY_DYKk';
const MY_SECRET_KEY = 'BquYyRR03J60gsdrCm-aTBhNsctbSaTURNhKa4ZhOFY';
// const MY_REDIRECT_URI = 'https://sova-disigner.ru/examples/diplom/';
const MY_REDIRECT_URI = 'http://127.0.0.1:8080';
const MY_SCOPE = 'write_likes+public';

const unsplashTokenUrl = 'https://unsplash.com/oauth/token';
const unsplashAuthUrl = 'https://unsplash.com/oauth/authorize';

// const FOTOS_PER_PAGE = 10;
const FOTOS_PER_PAGE = 3;
const PAGE = 1;

// debugger;

export const viewPhoto = (id) => {
    return {
        type: 'VIEW_PHOTO',
        id
    }
}

const unsplash = createApi(
    {
        accessKey: MY_ACCESS_KEY,
        client_id: MY_SECRET_KEY,
        redirect_uri: MY_REDIRECT_URI,
        response_type: 'code',
        scope: MY_SCOPE,
    }
);
///
let counterLoad = 0
const countLoad = () => {
    counterLoad++;
}
///
export const loadFotos = () => {
    countLoad(); ///

    return (dispatch) => {
        debugger;
        // console.log('load counter ' + counterLoad);

        dispatch(loadFotosRequest());

        unsplash.photos.list({
            page: PAGE,
            perPage: FOTOS_PER_PAGE * counterLoad,
            orderBy: 'latest',
        }).then(result => {
            if (result.errors) {
                // вывод ошибок
                console.log('error occurred: ', result.errors[0]);

                dispatch(loadFotosFailure(result.errors[0]));
            } else {
                const feed = result.response;
                // extract total and results array from response
                const { total, results } = feed;

                // вывод результата успешного запроса
                console.log(`received ${results.length} photos out of ${total}`);
                // console.log(results);

                let fotosArr = [];

                for (let prop in results) {
                    if (results.hasOwnProperty(prop)) {
                        fotosArr = [
                            ...fotosArr,
                            {
                                id: results[prop].id,
                                updated_at: results[prop].updated_at,
                                alt_description: results[prop].alt_description,
                                user: {
                                    name: results[prop].user.name,
                                    links: {
                                        html: results[prop].user.links.html
                                    },
                                },
                                urls: {
                                    small: results[prop].urls.small,
                                    regular: results[prop].urls.regular,
                                    full: results[prop].urls.full,
                                },
                                likes: results[prop].likes,
                                liked_by_user: results[prop].liked_by_user,
                            }
                        ];

                    }
                }
                console.log('PHOTOS ARROW: ', fotosArr);

                dispatch(loadFotosSuccess(fotosArr));
            }
        });
    }
};

const loadFotosRequest = () => {
    return {
        type: 'LOAD_FOTOS_REQUEST',
    }
}

const loadFotosFailure = (er) => {
    return {
        type: 'LOAD_FOTOS_FAILURE',
        error: 'С загрузкой фото что-то пошло нет так: ' + er,
    }
}

const loadFotosSuccess = (payload) => {
    return {
        type: 'LOAD_FOTOS_SUCCESS',
        payload,
    }
}
///
export const requestAuth = () => {
    debugger;

    const url = new URL(unsplashAuthUrl);
    const params = {
        client_id: MY_ACCESS_KEY,
        redirect_uri: MY_REDIRECT_URI,
        response_type: 'code',
        score: MY_SCOPE,
    }
    url.search = new URLSearchParams(params).toString();

    sessionStorage.setItem('fotoViewerSentRequest', 'true');
    location.assign(url);
    // fetch(url);
}

///
export const requestAuthToken = (code) => {
    // debugger;
    const reqParamBody = {
        grant_type: 'authorization_code',
        client_id: MY_ACCESS_KEY,
        client_secret: MY_SECRET_KEY,
        redirect_uri: MY_REDIRECT_URI,
        code: code,
    }
    // console.log(reqParamBody);

    const status = response => {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
    }
    const json = response => {
        console.log(response.headers.get('content-type'));
        return response.json()
    }

    return (dispatch) => {
        //     debugger;
        dispatch(requestAuthTokenMake());

        fetch(unsplashTokenUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json, charset=UTF-8'
            },
            body: JSON.stringify(reqParamBody),
        })
            .then(status)
            .then(json)
            .then(data => {
                console.log('DATA', data);
                const payload = data.access_token;
                // console.log('TOKEN: ', payload);
                // requestAuthTokenSuccess(payload);
                dispatch(requestAuthTokenSuccess(payload));
            })
            .catch(error => {
                console.log('error', error);
                // requestAuthTokenFail(error);
                dispatch(requestAuthTokenFail(error));
            })
    }
}

const requestAuthTokenMake = () => {
    return {
        type: 'TOKEN_REQUEST_MAKE',
    }
}

const requestAuthTokenFail = (er) => {
    return {
        type: 'TOKEN_REQUEST_FAIL',
        error: 'С получением токена что-то пошло нет так: ' + er,
    }
}

const requestAuthTokenSuccess = (payload) => {
    return {
        type: 'TOKEN_REQUEST_SUCCESS',
        payload
    }
}

export const toggleLike = (id, liked, token) => {
    debugger;
    const url = 'https://unsplash.com/photos/:' + id + '/like';

    if (liked === false) {
        return (dispatch) => {
            console.log('develope - test offshoot for non-liked photo');

            // dispatch(toggleLikeSuccess('test offshoot for non-liked photo'));

            fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json, charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                },
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log(response);

                        dispatch(toggleLikeSuccess('test offshoot for non-liked photo: ' + response));
                    }
                })
        }
    } else {
        console.log('develope - test offshoot for liked photo');
        dispatch(toggleLikeSuccess('test offshoot for liked photo'));
        // return (dispatch) => {
        //     fetch(url, {
        //         method: 'DELETE',
        //     })
        // }
    }
}

const toggleLikeFailure = (er) => {
    return {
        type: 'TOGGLE_LIKE_FAIL',
        error: 'Лайк не прошел: ' + er,
    }
}

const toggleLikeSuccess = (statusOfLike) => {
    return {
        type: 'TOGGLE_LIKE_SUCCESS',
        statusOfLike
    }
}