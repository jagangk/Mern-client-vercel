import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { UserContext } from "../userContext";
import Footer from "../footer";
import { Helmet } from 'react-helmet';

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/post/${id}`);
                if (response.ok) {
                    const postData = await response.json();
                    setPostInfo(postData);
                } else {
                    console.error("Failed to fetch post");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading)  return <p>Loading posts...</p>; 
    if (!postInfo) return null;
    const url_photo = `${postInfo.cover}`;

    const handleDropdownChange = async (e) => {
        const selectedValue = e.target.value;
    
        if (selectedValue.startsWith('edit')) {
            navigate(`/${selectedValue}`);
        } else if (selectedValue === 'delete') {
            const confirmDelete = window.confirm("Are you sure you want to delete this post?");
            if (confirmDelete) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/post/${postInfo._id}`, {
                        method: 'DELETE',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        alert('Post Deleted');
                        navigate('/', { replace: true });
                        window.location.reload();
                        window.scrollTo(0, 0);
                    } else {
                        console.error(data.error);
                    }
                } catch (error) {
                    console.error("Failed to delete post", error);
                }
            }
        } else if (selectedValue === 'report') {
            navigate('/report');
        }
    };


    return (
        <>
        <Helmet>
                <title>{postInfo.title}</title>
                <meta name="description" content={postInfo.summary} />
                
        </Helmet>

        <div className='post-page'>
            <h2>{postInfo.title}</h2>
            <div className='post-info'>
                <div className='author'>{postInfo.author.username}</div>•
                <time>{format(new Date(postInfo.createdAt), 'dd/LL/yyyy')}</time>•
                <div className="author" style={{color:'#0097B2'}}>{postInfo.PostType}</div>
            </div>
        <div className="action-container">
            <div className='dropdown-container'>
                <select onChange={handleDropdownChange}>
                    <option disabled="">Options</option>
                    {userInfo.id === postInfo.author._id && (
                        <>
                            <option value={`edit/${postInfo._id}`}>Edit</option>
                            <option value="delete">Delete</option>
                        </>
                    )}
                    <option value="report">Report</option>
                </select>
            </div>

<ul className="social-menu-post">
    <li>
        <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
            target="_blank" 
            rel="noopener noreferrer"
        >
            <i className="fa fa-facebook"></i>
        </a>
    </li>
    <li>
        <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(postInfo.title)}`} 
            target="_blank" 
            rel="noopener noreferrer"
        >
            <i className="fa fa-twitter"></i>
        </a>
    </li>
    <li>
        <a 
            href={`instagram://library?AssetPath=${encodeURIComponent(url_photo)}&InstagramCaption=${encodeURIComponent(postInfo.title)}`} 
            target="_blank" 
            rel="noopener noreferrer"
        >
            <i className="fa fa-instagram"></i>
        </a>
    </li>
    <li>
        <a 
            href={`whatsapp://send?text=Check out this post: ${postInfo.title} Click here: ${window.location.href}`} 
            data-action="share/whatsapp/share"
            target="_blank"
            rel="noopener noreferrer"
        >
            <i className="fa fa-whatsapp"></i>
        </a>
    </li>
   </ul>
        </div>
            <div className='image'>
                <img src={url_photo} alt="Post Cover" />
            </div>
            <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
        <Footer />
        </>
    );
}