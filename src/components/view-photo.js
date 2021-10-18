//
import React, { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import '../scss/photo-view.scss';

const ViewerPhoto = (props) => {
    // debugger;
    const { rootReducer, toggleLike } = props;
    const authToken = rootReducer.fotos.authToken;
    let viewedPhoto = rootReducer.fotos.viewedPhoto;

    if (viewedPhoto.id === "no_photo" && sessionStorage.fotoViewerViewedPhoto) {
        viewedPhoto = JSON.parse(sessionStorage.fotoViewerViewedPhoto);
    }

    let signLikes = viewedPhoto.likedByUser ? 'liked' : '';

    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
    const hideElem = document.querySelector('.top-block');
    const extraHeight = parseInt(getComputedStyle(document.querySelector('.main-block')).marginTop) + parseInt(getComputedStyle(document.querySelector('.main-block')).marginBottom);

    useLayoutEffect(() => {
        if (targetRef.current) {
            // debugger;
            hideElem.style.display = 'none';
            (targetRef.current).style.borderTopLeftRadius = '5px';
            (targetRef.current).style.borderTopRightRadius = '5px';

            let allowHeight = 0;
            let allowWidth = 0;
            if (window.innerHeight > window.innerWidth) {
                if (viewedPhoto.height <= viewedPhoto.width) {
                    allowHeight = 'auto';
                    allowWidth = '100%';
                } else if (viewedPhoto.height > viewedPhoto.width) {
                    allowHeight = window.innerHeight - (extraHeight + (targetRef.current).offsetHeight);
                    allowWidth = 'auto';
                }
                (targetRef.current).style.height = '100vh';
            } else if (window.innerHeight < window.innerWidth) {
                // if (viewedPhoto.height < viewedPhoto.width) {
                allowHeight = window.innerHeight - (extraHeight + (targetRef.current).offsetHeight);
                allowWidth = 'auto';
                // } else if (viewedPhoto.height >= viewedPhoto.width) {
                //     allowHeight = window.innerHeight - (extraHeight1 + (targetRef.current).offsetHeight);
                //     allowWidth = 'auto';
                // }
            }
            setDimensions({
                height: allowHeight,
                width: allowWidth,
            });
        }
    }, []);

    return (
        <div className="photo-viewer" ref={targetRef}>
            <Link onClick={() => {
                if (hideElem.style.display == 'none') {
                    hideElem.style.display = 'block';
                    (targetRef.current).style.borderTopLeftRadius = '0';
                    (targetRef.current).style.borderTopRightRadius = '0';
                    (targetRef.current).style.height = '';
                }
            }} className="photo-viewer__back-btn back-btn" to='/'><span className="back-btn__arrow">&#9664;</span> Вернуться</Link>

            <article className="photo-data">
                <div className="img-wrapper">
                    {/* <img src={viewedPhoto.url} alt={viewedPhoto.altDescr} width='75%' loading="lazy" /> */}
                    <LazyLoadImage
                        alt={viewedPhoto.altDescr}
                        src={viewedPhoto.url}
                        width={dimensions.width}
                        height={dimensions.height}
                        placeholderSrc={'./images/placeholder.svg'}
                    />
                </div>

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

                            <span className="like-count">: {viewedPhoto.likes}</span>
                        </button>
                    </span>
                </div>
            </article>
        </div>
    )
}

export default ViewerPhoto;