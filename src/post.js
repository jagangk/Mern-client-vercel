import {format} from 'date-fns'
import { Link} from 'react-router-dom';
export default function Post({_id,author,createdAt,title,summary,cover,PostType}){
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
            <Link class="author">{author.username}</Link>•
            <time> {format(new Date(createdAt), 'dd/LL/yyyy')} </time>
          </p>
          <p className='summary'>{summary}...<Link style={{color:'#6C93A4', fontStyle:'italic'}} to={`/post/${_id}`} >Read more</Link></p>
        </div>
      </div>
    );
}
