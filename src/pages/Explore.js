import { useState, useEffect } from "react";
import Navbar from "../Explorebar";
import Post from "../post";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("Trending");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (category) => {
    setLoading(true);
    try {
      let url;
      if (category === "Trending") {
        url = `${process.env.REACT_APP_API_URL}/posts/latest`;
      } else {
        url = `${process.env.REACT_APP_API_URL}/posts/category/${category}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="explore-main">
      <Navbar />
      <div className="explore-container">
        {[
          "Trending",
          "News",
          "Business",
          "Technology",
          "Sports",
          "Entertainment",
          "Opinions",
          "Science",
          "Health",
          "Travel",
          "Food",
        ].map((category) => (
          <div className="explore-box" key={category}>
            <button
              className="explore-button"
              onClick={() => handleCategoryClick(category)}
            >
              <span className="material-symbols-outlined">
                {category === "Trending" && "trending_up"}
                {category === "News" && "newspaper"}
                {category === "Business" && "monitoring"}
                {category === "Technology" && "phone_iphone"}
                {category === "Sports" && "sports_soccer"}
                {category === "Entertainment" && "sports_esports"}
                {category === "Science" && "experiment"}
                {category === "Opinions" && "campaign"}
                {category === "Health" && "health_and_beauty"}
                {category === "Travel" && "flight_takeoff"}
                {category === "Food" && "fastfood"}
              </span>
              <p>{category}</p>
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", margin: "10px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post._id} {...post} />)
          ) : (
            <p>No posts found in this category</p>
          )}
        </div>
      )}
    </div>
  );
}
