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
import ReportPost from './pages/reportpage';
import ChangePassword from './pages/reset-password';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './ProtectedRoute';
import PlagiarismChecker from './pages/plagiarism-checker';
import ContentChecker from './pages/contentChecker';
import About from './pages/about';
import Explore from './pages/Explore';

function App() {

  return (
    <UserContextProvider>
      <Routes>
       <Route path ="/" element = {<Layout />}>
         <Route index element = {<IndexPage />} />
         <Route path = "/login" element = {<LoginPage />} />
         <Route path = "/register" element = {<RegisterPage />} />
         <Route path = "/ResetPassword" element = {<ChangePassword />} />
         <Route path='/create' element = {<ProtectedRoute><CreatePost /></ProtectedRoute>} />
         <Route path = "/post/:id" element = {<PostPage />}/>
         <Route path = "/contact" element = {<ContactPage />} />
         <Route path = "/about" element = {<About />} />
         <Route path = "/Explore" element = {<Explore />} />
         <Route path = "/edit/:id" element = {<EditPost />} />
         <Route path = "/PlagGuard" element = {<PlagiarismChecker />} />
         <Route path = "/safecontent" element = {<ContentChecker />} />
         <Route path = "/report" element = {<ReportPost />} />
         <Route path= "/user/:username" element = {<UserProfile />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
