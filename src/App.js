import './App.css';
import Layout from './layout';
import IndexPage from './pages/indexpage';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import {Routes,Route,} from "react-router-dom";
import { UserContextProvider } from './userContext';
import CreatePost from './pages/createpost';
import PostPage from './pages/postpage';
import ContactPage from './pages/contactpage';
import EditPost from './pages/editpost';

function App() {

  return (
    <UserContextProvider>
      <Routes>
       <Route path ="/" element = {<Layout />}>
         <Route index element = {<IndexPage />} />
         <Route path = "/login" element = {<LoginPage />} />
         <Route path = "/register" element = {<RegisterPage />} />
         <Route path='/create' element = {<CreatePost />} />
         <Route path = "/post/:id" element = {<PostPage />}/>
         <Route path = "/contact" element = {<ContactPage />} />
         <Route path = "/edit/:id" element = {<EditPost />} />

        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
