import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import '../scss/list-fotos.scss';

const FotosList = (props) => {
    // debugger;
    const { rootReducer, viewPhoto, loadFotos, getLikesInfo } = props;
    const fotosArr = rootReducer.fotos.fotosArr;

    const authToken = rootReducer.fotos.authToken;

    return (
        <div className="fotos-list">
            <h2 className="fotos-list__title">Последние фото:</h2>

            <ol className="fotos-list__list">{fotosArr.map(foto => {
                // console.log('PhotoID: ' + foto.id);
                return (
                    <li className="fotos-list__item photo-item" key={foto.id}>
                        <div className="photo-item__pic">
                            <Link to='/view_photo_index'>
                                {/* <img src={foto.urls.small} alt={foto.alt_description} loading="lazy" onClick={ev => {
                                viewPhoto(foto.id);
                            }} /> */}
                                <LazyLoadImage
                                    alt={foto.alt_description}
                                    // height={'100%'}
                                    src={foto.urls.small}
                                    width={'100%'}
                                    effect={'opacity'}
                                    // onClick={() => {
                                    //     viewPhoto(foto.id);
                                    // }}
                                    onClick={() => {
                                        viewPhoto(foto.id);
                                        getLikesInfo(foto.id, authToken);
                                    }}
                                />
                            </Link>
                        </div>

                        <div className="photo-item__desc photo-desc">
                            <p> Photo by&ensp;
                                <a className="photo-item__link" href={foto.user.links.html + '?utm_source=Photo_Lenta&utm_medium=referral'}>{foto.user.name}</a>&ensp;
                                on&ensp;<a href="https://unsplash.com/?utm_source=Photo_Lenta&utm_medium=referral">Unsplash</a>
                            </p>

                            <div className="photo-desc__details">
                                <time className="photo-item__update" dateTime={foto.updated_at}>
                                    <span>
                                        {(new Date(foto.updated_at)).toLocaleDateString()}
                                    </span>
                                </time>
                                {/* <time className="photo-item__update" dateTime={foto.created_at}>
                                    <span>
                                        {(new Date(foto.created_at)).toLocaleDateString()}
                                    </span>
                                </time> */}

                                <span className="photo-item__likes">
                                    <span className="like-sign">&#9829;</span> {foto.likes}
                                </span>
                            </div>
                        </div>
                    </li>
                )
            })}
            </ol>

            <div className="fotos-list__btn checked-elem">
                <button className="load-fotos-btn" onClick={() => {
                    loadFotos();
                }}>Загрузить ещё фото...</button>
            </div>
        </div>
    )
}

export default FotosList;