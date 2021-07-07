import React from 'react';
import { Link } from 'react-router-dom';

const FotosList = (props) => {
    // debugger;
    const { rootReducer, viewPhoto, loadFotos, } = props;
    const fotosArr = rootReducer.fotos.fotosArr;

    return (
        <div>
            <h2>Последние фото</h2>

            <ol>{fotosArr.map(foto => {
                // console.log('PhotoID: ' + foto.id);
                let signLikes = foto.liked_by_user ? 'liked' : '';

                return (
                    <li key={foto.id}>

                        <Link to='/view_photo_index'>
                            <img src={foto.urls.small} alt={foto.alt_description} loading="lazy" onClick={ev => {
                                // debugger;
                                viewPhoto(foto.id);
                            }} />
                        </Link>

                        <div>
                            <p> Photo by&ensp;
                                <a href={foto.user.links.html}>{foto.user.name}</a>&ensp;
                                on&ensp;<a href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral">Unsplash</a>
                            </p>

                            <time dateTime={foto.updated_at}>
                                <span>
                                    {(new Date(foto.updated_at)).toLocaleDateString()}
                                </span>
                            </time>

                            <span>
                                <span className={signLikes}>&#9829;</span>: {foto.likes}
                            </span>

                        </div>
                    </li>
                )
            })}
            </ol>
            <div>
                <button onClick={() => {
                    // debugger;
                    loadFotos();
                }}>Загрузить ещё фото</button>
            </div>
        </div>
    )
}

export default FotosList;