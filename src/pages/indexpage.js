import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { UserContext } from "../userContext";
import Post from "../post";
import Footer from "../footer";
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function IndexPage() {
    const { posts, setPosts } = useContext(UserContext);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        fetchPosts(1);
    }, []);

    const fetchPosts = async (page) => {
        setLoading(true);
        const url = `${process.env.REACT_APP_API_URL}/post?page=${page}&limit=10`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.length < 10) {
                setHasMore(false);
            }
            setPosts(prevPosts => page === 1 ? data : [...prevPosts, ...data]);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }
    };

    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (page > 1) {
            fetchPosts(page);
        }
    }, [page]);

    return (
        <>
    {posts.length > 0 && (
        <div className='home-index'><h1>Feeds</h1></div>
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
    )}
    {loading && page > 1 && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
    <Footer />
    </>
    );
}
