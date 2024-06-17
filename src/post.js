import React, { forwardRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const Post = forwardRef(({ _id, author, createdAt, title, summary, cover }, ref) => {
    const relativeTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

    return (
        <div ref={ref} key={_id} className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={cover} alt='' />
                </Link>
            </div>
            <div className="text">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className='summary'>
                    {summary}
                    <Link to={`/post/${_id}`}>...more</Link>
                </p>

                <p className="info">
                    <Link className="author">{author.username}</Link>
                    <time>• {relativeTime}</time>
                </p>

            </div>
        </div>
    );
});

export default Post;
