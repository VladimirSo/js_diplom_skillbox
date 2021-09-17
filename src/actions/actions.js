import { createApi } from 'unsplash-js';
//
const MY_USERNAME = 'sovlal';
const MY_ACCESS_KEY = 'GfrfHdu7zljXSCIAGzglYINpnQJ7tMSgWG2xnY_DYKk';
const MY_SECRET_KEY = 'BquYyRR03J60gsdrCm-aTBhNsctbSaTURNhKa4ZhOFY';
// const MY_REDIRECT_URI = 'https://sova-disigner.ru/examples/diplom/';
const MY_REDIRECT_URI = 'http://127.0.0.1:8080';
const MY_SCOPE = 'write_likes+public';

const unsplashTokenUrl = 'https://unsplash.com/oauth/token';
const unsplashAuthUrl = 'https://unsplash.com/oauth/authorize';

// const FOTOS_PER_PAGE = 10;
const FOTOS_PER_PAGE = 5;
const PAGE = 1;
// debugger;
//// выбор фото для промотра
export const viewPhoto = (id) => {
    return {
        type: 'VIEW_PHOTO',
        id
    }
}
//// получение инфо по выбранной фото
export const getLikesInfo = (id, token) => {
    // debugger;
    const url = 'https://api.unsplash.com/photos/' + id;

    const status = response => {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
    }
    const json = response => {
        return response.json()
    }

    return (dispatch) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json, charset=UTF-8',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(status)
            .then(json)
            .then(data => {
                const payload = {
                    id: data.id,
                    liked_by_user: data.liked_by_user,
                }
                dispatch(getLikesInfoSuccess(payload));
            })
            .catch(error => {
                console.log('like error: ', error);
                dispatch(getLikesInfoFailure(error));
            });
    }
}

const getLikesInfoSuccess = (payload) => {
    return {
        type: 'GET_PHOTO_INFO',
        payload,
    }
}
const getLikesInfoFailure = (er) => {
    return {
        type: 'GET_PHOTO_INFO_ERROR',
        er: 'Ошибка запроса для фото: ' + er,
    }
}

// 
const unsplash = createApi(
    {
        accessKey: MY_ACCESS_KEY,
        client_id: MY_SECRET_KEY,
        redirect_uri: MY_REDIRECT_URI,
        response_type: 'code',
        scope: MY_SCOPE,
    }
);
//
let counterLoad = 0
const countLoad = () => {
    counterLoad++;
}
//// ф-я загрузки фото
export const loadFotos = () => {
    // debugger;
    countLoad();

    return (dispatch) => {
        console.log('Number of loading: ' + counterLoad);

        dispatch(loadFotosRequest());

        unsplash.photos.list({
            page: PAGE * counterLoad,
            perPage: FOTOS_PER_PAGE,
            orderBy: 'latest',
        }).then(result => {
            if (result.errors) {
                // вывод ошибок
                console.log('error occurred: ', result.errors[0]);

                dispatch(loadFotosFailure(result.errors[0]));
            } else {
                const feed = result.response;
                // извлекаем total и массив results из response
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
                                created_at: results[prop].created_at,
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
                // console.log('PHOTOS ARROW: ', fotosArr);
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
//// ф-я запроса authorization code
export const requestAuth = () => {
    // debugger;
    // const url = new URL(unsplashAuthUrl);
    // const params = {
    //     client_id: MY_ACCESS_KEY,
    //     redirect_uri: MY_REDIRECT_URI,
    //     response_type: 'code',
    //     score: MY_SCOPE,
    // }
    // url.search = new URLSearchParams(params).toString();

    sessionStorage.setItem('fotoViewerSentRequest', 'true');

    // location.assign(url);
    location.assign(`https://unsplash.com/oauth/authorize?client_id=${MY_ACCESS_KEY}&redirect_uri=${MY_REDIRECT_URI}&response_type=code&scope=${MY_SCOPE}`);
}

/// ф-я запроса access token`а
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
                // console.log('DATA', data);
                const payload = data.access_token;
                // console.log('TOKEN: ', payload);
                localStorage.setItem('fotoViewerAuthToken', payload);
                // requestAuthTokenSuccess(payload);
                dispatch(requestAuthTokenSuccess(payload));
            })
            .catch(error => {
                console.log('error: ', error);
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

//// ф-я установки/снятия лайка
export const toggleLike = (id, liked, token) => {
    // debugger;
    const url = 'https://api.unsplash.com/photos/' + id + '/like';

    // const status = response => {
    //     if (response.status !== 201) {
    //         return Promise.reject(new Error(response.statusText))
    //     }
    //     return Promise.resolve(response)
    // }
    const json = response => {
        // console.log(response.headers.get('content-type'));
        return response.json()
    }

    if (!liked) {
        const status = response => {
            if (response.status !== 201) {
                return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        }

        return (dispatch) => {
            // console.log('test offshoot for non-liked photo');
            fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json, charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                },
            })
                .then(status)
                .then(json)
                .then(data => {
                    // console.log('liked photo data: ', data.photo);
                    const payload = {
                        id: data.photo.id,
                        likes: data.photo.likes,
                        liked_by_user: data.photo.liked_by_user,
                    }
                    dispatch(toggleLikeSuccess(payload));
                })
                .catch(error => {
                    console.log('like error: ', error);
                    dispatch(toggleLikeFailure(error));
                });
        }
    } else {
        const status = response => {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        }
        // console.log('test offshoot for liked photo');
        return (dispatch) => {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json, charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                },
            })
                .then(status)
                .then(json)
                .then(data => {
                    const payload = {
                        id: data.photo.id,
                        likes: data.photo.likes,
                        liked_by_user: data.photo.liked_by_user,
                    }
                    dispatch(toggleLikeSuccess(payload));
                })
                .catch(error => {
                    console.log('like error: ', error);
                    dispatch(toggleLikeFailure(error));
                });
        }
    }
}

const toggleLikeFailure = (er) => {
    return {
        type: 'TOGGLE_LIKE_FAIL',
        error: 'Лайк не прошел: ' + er,
    }
}
const toggleLikeSuccess = (likedPhoto) => {
    return {
        type: 'TOGGLE_LIKE_SUCCESS',
        likedPhoto
    }
}


// //// ф-я получения id лайкнутых фото 
// export const getLikedFotos = () => {
//     return (dispatch) => {
//         debugger;
//         dispatch(getLikedFotosMake());

//         unsplash.users.getLikes({
//             username: MY_USERNAME,
//             perPage: 10,
//         }).then(result => {
//             if (result.error) {
//                 dispatch(getLikedFotosFailure(result.errors[0]));
//             } else {
//                 const feed = result.response;
//                 const results = feed.results;
//                 // console.log(feed);
//                 // console.log(results);
//                 let likedFotosArr = [];

//                 for (let prop in results) {
//                     if (results.hasOwnProperty(prop)) {
//                         likedFotosArr = [
//                             ...likedFotosArr,
//                             {
//                                 id: results[prop].id,
//                             }
//                         ];
//                     }
//                 }
//                 // console.log('LIKED PHOTOS ID`S ARROW: ', likedFotosArr);
//                 dispatch(getLikedFotosSuccess(likedFotosArr));
//             }
//         });
//     }
// }

// const getLikedFotosMake = () => {
//     return {
//         type: 'GET_LIKED_FOTOS_MAKE',
//     }
// }
// const getLikedFotosFailure = (error) => {
//     return {
//         type: 'GET_LIKED_FOTOS_FAILURE',
//         error: 'Get Liked Error: ' + error,
//     }
// }
// const getLikedFotosSuccess = (payload) => {
//     return {
//         type: 'GET_LIKED_FOTOS_SUCCESS',
//         payload,
//     }
// }