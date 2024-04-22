import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { UserContext } from "../userContext";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(() => {
        const storedPostInfo = localStorage.getItem('postInfo');
        return storedPostInfo ? JSON.parse(storedPostInfo) : null;
    });
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/post/${id}`;
        fetch(url)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                    localStorage.setItem('postInfo', JSON.stringify(postInfo));
                });
            });
    }, [id]); 

    if (!postInfo) return '';

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
                        console.log(data.message);
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
        <div className='post-page'>
            <h2>{postInfo.title}</h2>
            <div className='post-info'>
                <div className='author'>{postInfo.author.username}</div>
                <time>{format(new Date(postInfo.createdAt), 'dd/LL/yyyy')}</time>
    
                <div className='dropdown-container'>
                    <select onChange={handleDropdownChange}>
                        <option disabled = "">Actions</option>
                        {userInfo.id === postInfo.author._id && (
                            <>
                                <option value={`edit/${postInfo._id}`}>Edit</option>
                                <option value="delete">Delete</option>
                            </>
                        )}
                        <option value="report">Report</option>
                    </select>
                </div>
            </div>

            <div className='image'>
                <img src={url_photo} alt="Post Cover" />
            </div>
            <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
    );
}
