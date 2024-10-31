import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../userContext";
import Footer from "../footer";
import { Helmet } from "react-helmet";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Post from "../post";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const LOCAL_STORAGE_KEY = `post-${id}`;
  const hasFetchedPost = useRef(false);

  useEffect(() => {
    const fetchPostFromStorage = () => {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        try {
          const { post, timestamp } = JSON.parse(storedData);
          const currentTime = Date.now();
          const cacheDuration = 24 * 60 * 60 * 1000;

          if (currentTime - timestamp < cacheDuration) {
            setPostInfo(post);
            setLoading(false);
            hasFetchedPost.current = true;
          }
        } catch (error) {
          console.error("Error parsing stored post:", error);
        }
      }
    };

    const fetchPostFromAPI = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/post/${id}`
        );
        if (response.ok) {
          const postData = await response.json();

          // Only store in localStorage if post has changed or isn't in storage
          if (
            !hasFetchedPost.current ||
            postData.updatedAt !== postInfo?.updatedAt
          ) {
            setPostInfo(postData);
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify({ post: postData, timestamp: Date.now() })
            );
          }
        } else {
          console.error("Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostFromStorage();
    if (!hasFetchedPost.current) {
      fetchPostFromAPI();
    }
  }, [id, LOCAL_STORAGE_KEY]);

  useEffect(() => {
    if (postInfo?.PostType) {
      const fetchPosts = async (category) => {
        setLoading(true);
        try {
          const url = `${process.env.REACT_APP_API_URL}/posts/category/${category}`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            const filteredPosts = data
              .filter((post) => post._id !== postInfo._id)
              .slice(0, 6);
            setPosts(filteredPosts);
          } else {
            console.error("Failed to fetch related posts");
          }
        } catch (error) {
          console.error("Error fetching related posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts(postInfo.PostType);
    }
  }, [postInfo?.PostType, postInfo?._id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (!postInfo) return null;

  const url_photo = `${postInfo.cover}`;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete && postInfo?._id) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/post/${postInfo._id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Post Deleted");
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          navigate("/", { replace: true });
          window.location.reload();
          window.scrollTo(0, 0);
        } else {
          const data = await response.json();
          console.error(data.error);
        }
      } catch (error) {
        console.error("Failed to delete post", error);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{postInfo.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content={postInfo.summary} />
        <meta name="keywords" content={postInfo.keywords?.join(", ")} />
        <meta property="og:title" content={postInfo.title} />
        <meta property="og:description" content={postInfo.summary} />
        <meta property="og:image" content={postInfo.cover} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postInfo.title} />
        <meta name="twitter:description" content={postInfo.summary} />
        <meta name="twitter:image" content={postInfo.image} />
        <meta name="twitter:site" content="@YourTwitterHandle" />
        <meta name="robots" content="index, follow" />
        <html lang="en" />
        <meta charset="UTF-8" />
      </Helmet>

      <div className="post-page">
        <h2>{postInfo.title}</h2>
        <div className="post-basic-info-box">
          <p>{postInfo.views} views</p>
          <p>•</p>
          <time>
            <p>{format(new Date(postInfo.createdAt), "dd-L-yyyy")}</p>
          </time>
        </div>

        <div className="action-container">
          <div className="dropdown-container">
            <div className="index-promo">
              {userInfo?.id === postInfo.author._id && (
                <>
                  <Link
                    style={{ padding: "0", margin: "0" }}
                    to={`/edit/${postInfo._id}`}
                  >
                    <div className="gicon-title">
                      <span className="material-symbols-outlined">edit</span>
                      <p>Edit</p>
                    </div>
                  </Link>
                  <Link onClick={handleDelete}>
                    <div className="gicon-title">
                      <span className="material-symbols-outlined">delete</span>
                      <p>Delete</p>
                    </div>
                  </Link>
                </>
              )}
              {userInfo?.id !== postInfo.author._id && (
                <>
                  <Link
                    to={`/user/${postInfo.author.username}`}
                    style={{ padding: "0", margin: "0" }}
                  >
                    <div className="gicon-title">
                      <span className="material-symbols-outlined">person</span>
                      <p>{postInfo.author.username}</p>
                    </div>
                  </Link>
                  <Link
                    to="/report"
                    state={{
                      author: postInfo.author.username,
                      postName: postInfo.title,
                    }}
                  >
                    <div className="gicon-title">
                      <span className="material-symbols-outlined">flag</span>
                      <p>Report</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Social Share Links */}
          {/* ... */}
        </div>

        <div className="image">
          <img src={url_photo} alt="Post Cover" />
        </div>

        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>

      <div className="related">
        <hr></hr>
        <h4>Related Articles</h4>
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post._id} {...post} />)
          ) : (
            <p>No posts found in this category</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
