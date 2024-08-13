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
    // Function to fetch the post from local storage
    const fetchPostFromStorage = () => {
      const storedPost = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPost) {
        try {
          const parsedPost = JSON.parse(storedPost);
          setPostInfo(parsedPost);
          setLoading(false);
          hasFetchedPost.current = true; // Mark as fetched
        } catch (error) {
          console.error("Error parsing stored post:", error);
        }
      }
    };

    // Function to fetch the post from the API
    const fetchPostFromAPI = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/post/${id}`
        );
        if (response.ok) {
          const postData = await response.json();
          setPostInfo(postData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(postData));
        } else {
          console.error("Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    // First, check if the post is already fetched and stored locally
    fetchPostFromStorage();

    // Always fetch the post from the API
    fetchPostFromAPI();
  }, [id, LOCAL_STORAGE_KEY]); // Depend on id and LOCAL_STORAGE_KEY to trigger on change

  // Separate useEffect for fetching related posts based on the current post's category
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
              .slice(0, 6); // Limit to 6 related posts
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
  }, [postInfo?.PostType, postInfo?._id]); // Depend on PostType and postInfo._id

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
        <meta name="description" content={postInfo.summary} />
        <meta name="keywords" content={postInfo.keywords?.join(", ")} />
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

          <ul className="social-menu-post">
            <li>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-facebook"></i>
              </a>
            </li>
            <li>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(postInfo.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href={`instagram://library?AssetPath=${encodeURIComponent(
                  url_photo
                )}&InstagramCaption=${encodeURIComponent(postInfo.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-instagram"></i>
              </a>
            </li>
            <li>
              <a
                href={`whatsapp://send?text=${encodeURIComponent(
                  postInfo.title
                )} Click here: ${window.location.href}`}
                data-action="share/whatsapp/share"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-whatsapp"></i>
              </a>
            </li>
          </ul>
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
