import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { UserContext } from "../userContext";
import Post from "../post";
import Footer from "../footer";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Navbar from "../Navbar";

export default function IndexPage() {
  const { posts, setPosts, page, setPage, hasMore, setHasMore } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    // Fetch posts if not already fetching
    if (page === 1 && posts.length === 0) {
      fetchPosts(1);
    }
  }, [page, posts.length]);

  const fetchPosts = async (page) => {
    setLoading(true);
    const url = `${process.env.REACT_APP_API_URL}/post?page=${page}&limit=10`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length < 10) {
        setHasMore(false);
      }
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post._id));
        const newPosts = data.filter((post) => !existingIds.has(post._id));
        return [...prevPosts, ...newPosts];
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <>
      {posts.length >= 0 && (
        <>
          <Navbar />
        </>
      )}
      {posts.length > 0 ? (
        posts.map((post, index) => {
          if (posts.length === index + 1) {
            return <Post ref={lastPostElementRef} key={post._id} {...post} />;
          } else {
            return <Post key={post._id} {...post} />;
          }
        })
      ) : (
        <div className="loader">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      {loading && page > 1 && (
        <div className="loader">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      <Footer />
    </>
  );
}
