import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Post = forwardRef(({ _id, author, createdAt, title, summary, cover }, ref) => {
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
                    <time>{format(new Date(createdAt), 'dd-LL-yyyy')}</time>
                </p>
            </div>
        </div>
    );
});

export default Post;
