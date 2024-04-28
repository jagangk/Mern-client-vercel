import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

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

  const updateSummary = (ev) => {
    const inputSummary = ev.target.value;
    const limitedSummary = inputSummary.split(' ').slice(0, 30).join(' ');
    setSummary(limitedSummary);
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
    }
    else{
      alert('Failed to post');
    }
  };

  if (redirect) {
    alert('Post created🤩');
    <Navigate to='/' replace />;  
    window.location.href = '/';  
    window.scrollTo(0, 0);
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={'Title'}
        required
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <input
        type="summary"
        placeholder={'Brief'}
        required 
        value={summary}
        onChange={updateSummary}
      />

    <select id="PostType" value={PostType} onChange={(ev) => {setPostType(ev.target.value)}} required>
          <optgroup>
            <option disabled value="">Catagory</option>
            <option>Business</option>
            <option>News</option>
            <option>Science and Technology</option>
            <option>Entertainment</option>
            <option>Sports</option>
            <option>Health</option>
            <option>Lifestyle and Travel</option>
            <option>Food</option>
            <option>Opinions</option>
          </optgroup>
      </select>

      <input required type="file" onChange={(ev) => setFiles(ev.target.files)} />

      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
      />
      <button style={{ marginTop: '5px' }}>Post</button>
        <h3>Community Guidelines:</h3>
        <p>*Create respectful content - no explicit or offensive material, support for illegal activities, or piracy links. Respect user privacy, engage in civil communication, and report violations for a positive community. Violations may lead to content removal or account actions.</p>
    </form>
  );
}
