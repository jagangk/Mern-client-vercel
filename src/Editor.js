import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Snow theme (optional)

const Editor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const toolbarContainer = quillRef.current.querySelector('.ql-toolbar');
      toolbarContainer.style.height = '40px'; // Adjust height as desired (in pixels)
    }
  }, [value]); // Recalculate size on value change for dynamic content

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className = 'content'>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
};

export default Editor;
