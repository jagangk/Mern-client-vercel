import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from 'date-fns';
import { UserContext } from "../userContext";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(() => {
        // Try to get postInfo from localStorage if available
        const storedPostInfo = localStorage.getItem('postInfo');
        return storedPostInfo ? JSON.parse(storedPostInfo) : null;
    });
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/post/${id}`;
        fetch(url)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                    // Store postInfo in localStorage
                    localStorage.setItem('postInfo', JSON.stringify(postInfo));
                });
            });
    }, [id]); // Include id in dependencies to trigger effect on id change

    if (!postInfo) return '';

    const url_photo = `${postInfo.cover}`;

    return (
        <div className='post-page'>
            <h2>{postInfo.title}</h2>
            <div className='post-info'>
                <div className='author'>{postInfo.author.username}</div>
                <time>{format(new Date(postInfo.createdAt), 'dd/LL/yyyy')}</time>
                <div className='report-btn'>
                        <Link to = '/report'>
                            Report post
                        </Link>
                    </div>
                {userInfo.id === postInfo.author._id && (
                    <div className='edit-btn'>
                        <Link to={`/edit/${postInfo._id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit post
                        </Link>
                    </div>
                )}
            </div>

            <div className='image'>
                <img src={url_photo} alt="Post Cover" />
            </div>
            <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
    );
}
