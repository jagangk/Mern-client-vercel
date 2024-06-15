import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function ContentChecker() {
  const [text, setText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState('youtube');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (rewrittenText) {
      setIsLoaded(true);
    }
  }, [rewrittenText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsLoaded(false);
    setRewrittenText('');

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/content-check`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, platform })
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
    <>
      <Helmet>
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

        <p>SafeContent AI is an advanced artificial intelligence solution designed to ensure that your content adheres to the specific guidelines and policies of various platforms. Supports Adsense, Youtube, Instagram, and Facebook.</p>

        <div className="search-container">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className='content-select' required>
            <option value='youtube'>Youtube</option>
            <option value='adsense'>Adsense</option>
            <option value='instagram'>Instagram</option>
            <option value='facebook'>Facebook</option>
          </select>

          <input onChange={(e) => setText(e.target.value)} value={text} type="text" placeholder="Enter a text" className="search-input" />
          <button onClick={handleSubmit} type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-text">Checking...</span>
            ) : (
              <i className="fa fa-search"></i>
            )}
          </button>
        </div>

        {isLoading && (
          <div className="plagGuard-results" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
            <Box width='90%'>
              <Skeleton  variant="rectangular" width="100%" height={20} style={{ marginBottom: 8 }} />
              <Skeleton  variant="rectangular" width="100%" height={20} style={{ marginBottom: 8 }} />
              <Skeleton  variant="rectangular" width="100%" height={20} />
            </Box>
          </div>
        )}

        {isLoaded && rewrittenText && (
          <div className="plagGuard-results">
            <div className='plag-toolbar'>
              <img alt="ai" className="toolbar-icon" src="safe.png" />
            </div>
            <p>{rewrittenText}</p>
          </div>
        )}
      </form>
    </>
  );
}
