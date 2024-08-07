import {createContext, useState, useEffect } from "react";
export const UserContext = createContext({}); 

export function UserContextProvider({children}) {
    const [userInfo,setUserInfo] = useState({});
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/post`;
        fetch(url)
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    return(
        <UserContext.Provider value={{userInfo,setUserInfo,posts,setPosts,page,setPage,hasMore,setHasMore}}>
             {children}
        </UserContext.Provider> 
    );
}