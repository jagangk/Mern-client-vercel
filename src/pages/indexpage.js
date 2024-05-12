import { useContext, useEffect } from "react";
import { UserContext } from "../userContext"; 
import Post from "../post";
import { Link } from "react-router-dom";
import Footer from "../footer";

export default function IndexPage() {
    const { posts, setPosts } = useContext(UserContext);

    useEffect(() => {
        if (posts.length === 0) {
            const url = `${process.env.REACT_APP_API_URL}/post`;
            fetch(url)
                .then(response => response.json())
                .then(data => setPosts(data))
                .catch(error => console.error("Error fetching posts:", error));
        }
    }, [posts, setPosts]); 

    return (
        <>
            <div className='home-index'>
                <Link to="/"><img src="/blogsterabanner.png" alt="Blog Logo"/></Link>
                <h1>Feeds</h1>
            </div>
            {posts.length > 0 ? (
                posts.map(post => <Post key={post._id} {...post} />)
            ) : (
                <p style={{ color: '#6dacaae' }}>Loading posts...</p>
            )}
            <Footer />
        </>
    );
}
