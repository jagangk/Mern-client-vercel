import React from 'react';
import { useState } from 'react';
import { Helmet } from "react-helmet";


export default function ContentChecker() {
  const [text, setText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/content-check`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text , platform })
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
        <><Helmet>
            <title>Safe Content AI</title>
        </Helmet>
    <form className='safe-content'>
        <div className="gemini-icon-container">
          <div className="gicon-title">
            <img alt="ai logo" className="safeAI-icon" src="safe.png" />
            <h1>SafeContent AI</h1>
          </div>
          <div className="gicon-powered">
            <img alt="gemini logo" className="gemini-icon" src="google-gemini-icon.png" />
            <p>Gemini 1.5 Powered</p>
          </div>
        </div>

        <p>SafeContent AI is an advanced artificial intelligence solution designed to ensure that your content adheres to the specific guidelines and policies of various platforms.Supports Adsense, Youtube and Instagram.</p>


        <div className="search-container">

        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className='content-select' required>
          <optgroup>
            <option defaultValue='youtube'>Youtube</option>
            <option value='adsense'>Adsense</option>
            <option value='Instagram'>Instagram</option>
            <option value='Facebook'>Facebook</option>
          </optgroup>
        </select>

          <input onChange={(e) => setText(e.target.value)} value={text} type="text" placeholder="Enter a text" className="search-input" />
          <button onClick={handleSubmit}  type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-text">Checking...</span>
            ) : (
              <i className="fa fa-search"></i>
            )}
          </button>
        </div>

        {rewrittenText && (
          <div className="plagGuard-results">
            <div className='plag-toolbar'>
              <img alt="ai" className="toolbar-icon" src="safe.png" />
            </div>
            <p>{rewrittenText}</p>
          </div>
        )}

    </form></>
    );
}
