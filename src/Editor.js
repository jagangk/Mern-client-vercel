import ReactQuill from "react-quill";
import './App.css';

export default function Editor({value,onChange}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
        { script: 'sub' }, 
        { script: 'super'}
      ],
      ['link', 'image','video','code-block'],
      ['clean',],
    ],
  };
  return (
    <ReactQuill
      value={value}
      theme={'snow'}
      onChange={onChange}
      modules={modules} />
  );
}