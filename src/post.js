import {format} from 'date-fns'
import { Link} from 'react-router-dom';
export default function Post({_id,author,createdAt,title,summary,cover,PostType}){
  const url = `${process.env.REACT_APP_API_URL}/`;

    return (
        <div key={_id} class="post">
         <div class="image">
          <Link to={`/post/${_id}`}>
           <img src={cover} alt=''/>
          </Link>
        </div>

        <div class="text">
        <Link to={`/post/${_id}`}>
           <h2>{title}</h2>
        </Link>
          <p class="info">
            <Link class="author">{author.username}</Link>
            <time>{format(new Date(createdAt), 'dd/LL/yyyy')}</time>
          </p>
          <p className="info">Catagory • <a style={{color:'#0097B2'}}>{PostType}</a></p>
          <p className='summary'>{summary}...<i style={{color:'#6dcaae'}}>Read more</i></p>
        </div>
      </div>
    );
}
