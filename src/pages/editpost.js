import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [PostType, setPostType] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/post/`;
    fetch(url + id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
          setPostType(postInfo.PostType);
        });
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('PostType', PostType);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/update`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      localStorage.removeItem(`post-${id}`);  // Clear the stored post in local storage
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />

      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />

      <select type="PostType" value={PostType} onChange={ev => setPostType(ev.target.value)}>
          <optgroup>
            <option disabled value="">Category</option>
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

      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <button style={{ marginTop: '5px', marginBottom: '5px' }}>Update post</button>
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }}>Update post</button>
    </form>
  );
}

