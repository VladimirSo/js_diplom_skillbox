import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import '../scss/photo-view.scss';

const ViewerPhoto = (props) => {
    // debugger;
    const { rootReducer, toggleLike, getLikesInfo } = props;
    const authToken = rootReducer.fotos.authToken;
    let viewedPhoto = rootReducer.fotos.viewedPhoto;

    if (viewedPhoto.id === "no_photo" && sessionStorage.fotoViewerViewedPhoto) {
        viewedPhoto = JSON.parse(sessionStorage.fotoViewerViewedPhoto);
    }

    let signLikes = viewedPhoto.likedByUser ? 'liked' : '';

    return (
        <div className="photo-viewer">
            <Link className="photo-viewer__back-btn back-btn" to='/'><span className="back-btn__arrow">&#9664;</span> Вернуться</Link>

            <article className="photo-data">
                {/* <img src={viewedPhoto.url} alt={viewedPhoto.altDescr} width='75%' loading="lazy" /> */}
                <LazyLoadImage
                    alt={viewedPhoto.altDescr}
                    src={viewedPhoto.url}
                    width={'100%'}
                    placeholderSrc={'./images/placeholder.svg'}
                />

                <h2 className="photo-data__title">{viewedPhoto.altDescr}</h2>

                <p className="photo-data__links"> Photo by&ensp;
                    <a href={viewedPhoto.userLinks + '?utm_source=Photo_Lenta&utm_medium=referral'}>{viewedPhoto.userName}</a>&ensp;
                    on&ensp;<a href="https://unsplash.com/?utm_source=Photo_Lenta&utm_medium=referral">Unsplash</a>
                </p>

                <div className="photo-data__details">
                    <time dateTime={viewedPhoto.updatedAt}>
                        <span className="photo-data__time">
                            {(new Date(viewedPhoto.updatedAt)).toLocaleDateString()}
                        </span>
                    </time>
                    {/* <time dateTime={viewedPhoto.createdAt}>
                            <span className="photo-data__time">
                                {(new Date(viewedPhoto.createdAt)).toLocaleDateString()}
                            </span>
                        </time> */}

                    <span className="photo-data__likes">
                        <button onClick={() => {
                            toggleLike(viewedPhoto.id, viewedPhoto.likedByUser, authToken);
                        }}>
                            <span className={"like-sign" + " " + signLikes}>&#9829;</span>
                            {/* </button> */}
                            <span className="like-count">: {viewedPhoto.likes}</span>
                        </button>
                    </span>
                </div>
            </article>
        </div>
    )
    // }
}

export default ViewerPhoto;