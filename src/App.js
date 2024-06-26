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
         <Route path = "/edit/:id" element = {<ProtectedRoute><EditPost /></ProtectedRoute>} />
         <Route path = "/PlagGuard" element = {<PlagiarismChecker />} />
         <Route path = "/safecontent" element = {<ContentChecker />} />
         <Route path = "/report" element = {<ProtectedRoute><ReportPost /></ProtectedRoute>} />
         <Route path= "/user/:username" element = {<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
