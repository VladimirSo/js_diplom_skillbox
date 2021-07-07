import React from 'react';
import { Link } from 'react-router-dom';

const ViewerPhoto = (props) => {
    // debugger;
    const { rootReducer, toggleLike } = props;
    const viewedPhoto = rootReducer.fotos.viewedPhoto;
    const authToken = rootReducer.fotos.authToken;

    let signLikes = viewedPhoto.likedByUser ? 'liked' : '';

    return (
        <div>
            <h2>Single photo view page</h2>

            <Link to='/'>Back</Link>

            <article>
                <img src={viewedPhoto.url} alt={viewedPhoto.altDescr} width='75%' loading="lazy" />

                <p> Photo by&ensp;
                    <a href={viewedPhoto.userLinks}>{viewedPhoto.userName}</a>&ensp;
                    on&ensp;<a href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral">Unsplash</a>
                </p>

                <time dateTime={viewedPhoto.updatedAt}>
                    <span>
                        {(new Date(viewedPhoto.updatedAt)).toLocaleDateString()}
                    </span>
                </time>

                <span>
                    <button onClick={() => {
                        // debugger;
                        toggleLike(viewedPhoto.id, viewedPhoto.likedByUser, authToken);
                    }}>
                        <span className={signLikes}>&#9829;</span>
                    </button>
                    : {viewedPhoto.likes}
                </span>
            </article>
        </div>
    )
}

export default ViewerPhoto;