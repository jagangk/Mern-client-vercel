import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import ReactQuill from "react-quill";
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import 'react-quill/dist/quill.snow.css';
import Editor from "../Editor";

const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image'];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['link', 'image'],
    ['clean'],
    ['bold', 'italic', 'underline', 'strike'],
  ],
};

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [PostType, setPostType] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isOpen: isSuccessOpen, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();

  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
        timer = setTimeout(() => {
            onCloseSuccess();
            setSuccessMessage('');
        },3000);
    }

    if (isErrorOpen) {
        timer = setTimeout(() => {
          onCloseError();
          setErrorMessage('');
        }, 3000);
      }
      return () => {
        clearTimeout(timer);
      };

}, [isSuccessOpen, isErrorOpen]);
  
  const updateSummary = (ev) => {
    const inputSummary = ev.target.value;
    const limitedSummary = inputSummary.split(' ').slice(0, 30).join(' ');
    setSummary(limitedSummary);
  };

  const handleKeyDown = (event) => {
    const maxWords = 5;
    const words = event.target.value.split(' ');
    if (words.length >= maxWords && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  };

  const createNewPost = async (ev) => {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('PostType', PostType);
    data.set('file', files[0]);

    ev.preventDefault();
    console.log(files);
    const url = `${process.env.REACT_APP_API_URL}/post`;
    const response = await fetch(url, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    
    if (response.ok) {
      setRedirect(true);
      setSuccessMessage("Post created");
      onOpenSuccess();
    }

    else{
      setErrorMessage("Failed to create post");
      onOpenError();
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (redirect) {
        <Navigate to='/' replace />;  
        window.location.href = '/';  
        window.scrollTo(0, 0);
      }
    }, 3000); 
  
    return () => clearTimeout(timeoutId);
  }, [redirect]); 

  return (
    <>
    <Helmet>
      <title>Create Post</title>
    </Helmet>
    <form className="create" onSubmit={createNewPost}>

    {isSuccessOpen && (
        <Alert
          status='success'
          variant='subtle'
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='80px'
          colorScheme="red"
          borderRadius='10px'
          fontSize='small'
          gap={'10px'}
        >
          <AlertIcon color={"#6dcaae"} boxSize='30px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {successMessage}
          </AlertTitle>
        </Alert>
      )}

      {isErrorOpen && (
        <Alert
          status='error'
          variant='subtle'
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='80px'
          colorScheme="red"
          bg='#d83030'
          borderRadius='10px'
          fontSize='small'
          gap={'5px'}
        >
          <AlertIcon color={"#d83030"} boxSize='30px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {errorMessage}
          </AlertTitle>
        </Alert>
      )}
      
        <input
          type="title"
          placeholder={'Title'}
          required
          value={title}
          onChange={(ev) => setTitle(ev.target.value)} />

        <input
          type="summary"
          placeholder={'Brief'}
          required
          value={summary}
          onChange={updateSummary}
          onKeyDown={handleKeyDown} />

          <select id="PostType" value={PostType} onChange={(ev) => { setPostType(ev.target.value); } } required>
          <optgroup>
            <option disabled value="">Catagory</option>
            <option>Business</option>
            <option>News</option>
            <option>Science</option>
            <option>Technology</option>
            <option>Entertainment</option>
            <option>Sports</option>
            <option>Health</option>
            <option>Lifestyle</option>
            <option>Travel</option>
            <option>Food</option>
            <option>Opinions</option>
          </optgroup>
        </select>
        
        <input required type="file" onChange={(ev) => setFiles(ev.target.files)} />

        <Editor
          value={content}
          theme="snow"
          onChange={(newValue) => setContent(newValue)}
          modules={modules}
          formats={formats} />
          
        <button style={{ marginTop: '10px' }}>Post</button>
        <div className="contact-div">
          <p>Create respectful content - no explicit or offensive material, support for illegal activities, or piracy links. Respect user privacy, engage in civil communication, and report violations for a positive community. Violations may lead to content removal or account actions.</p>
        </div>
      </form></>
  );
}