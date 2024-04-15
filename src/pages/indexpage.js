import { useEffect, useState } from "react";
import Post from "../post";
import Footer from "../footer";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);
    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/post`;
        fetch(url).then(response => {
            response.json().then(posts =>{
                setPosts(posts);
            });
        });
    }, []);
    return (
    <>
        <div class ='hone-index'>
            <h1>Feeds</h1>
        </div>
       {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post} />
       ))}
       <Footer />
    </>
  );
}