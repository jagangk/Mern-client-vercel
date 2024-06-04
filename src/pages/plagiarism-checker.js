/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';

export default function PlagiarismChecker(){
  const [text, setText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/plagiarism-check`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
  
      if (response.ok) { 
        const data = await response.json(); 
        setRewrittenText(data.rewrittenText);
      } else {
        console.error(`API call failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
    return (
        <form className="plag-remover">
            
            <div className="gemini-icon-container">
              
              <div className="gicon-title">
                <img className="blogAI-icon" src = "blog-ai.png"></img>
                <h1>PlagGuard AI</h1>
              </div>
              
              <div className="gicon-powered">
                <img className="gemini-icon" src="google-gemini-icon.png"></img>
                <p>Gemini Powered</p>
              </div>
            </div>
            
            <p>PlagAi Guard is an advanced AI-driven tool designed to help you create plagiarism-free content. By leveraging the powerful capabilities of Gemini, PlagAi Guard not only detects potential plagiarism in your text but also provides intelligent suggestions and edits to ensure your work is original and authentic.</p>
            
            <div class="search-container">
              <input value={text} onChange={handleTextChange} type="text" placeholder="Enter the text" class="search-input"></input>
              <button onClick={handleSubmit} type="submit" class="search-button"><i class="fa fa-search"></i></button>
            </div>

            {rewrittenText && (
              <div class="plagGuard-results">
                <div className='plag-toolbar'>
                  <img className="toolbar-icon" src = "blog-ai.png"></img>
                  <button className='copy-btn' onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(rewrittenText)
                    .then(() => {
                      alert('Text copied to clipboard!');
                     })
                     .catch(err => {
                      console.error('Failed to copy text:', err);
                    });
                    }}><span class="material-symbols-outlined">content_copy</span></button>
                </div>
                <p>{rewrittenText}</p>
              </div>
            )}

        </form>
    );
}