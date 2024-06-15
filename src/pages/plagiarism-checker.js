import { Helmet } from "react-helmet";
import { useEffect } from "react";
import React, { useState } from 'react';
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function PlagiarismChecker() {
  const [text, setText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { isOpen: isSuccessOpen, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();

  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
        timer = setTimeout(() => {
            onCloseSuccess();
            setSuccessMessage('');
        },3000);
    }

      return () => {
        clearTimeout(timer);
      };

}, [isSuccessOpen]);
  
useEffect(() => {
  if (rewrittenText) {
    setIsLoaded(true);
  }
}, [rewrittenText]);

  function handleTextChange(event) {
    setText(event.target.value);
  }

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
    <>
      <Helmet>
        <title>PlagGuard - AI Plagiarism Remover</title>
        <meta name="description" content="PlagGuard AI is an advanced Gemini 1.5 powered tool designed to help you create plagiarism-free content. PlagGuard not only detects potential plagiarism in your text but also provides intelligent suggestions and edits to ensure your work is original and authentic." />
      </Helmet>
      <form className="plag-remover">
      {isSuccessOpen && (
        <Alert
          status='success'
          variant='subtle'
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          gap='10px'
          textAlign='center'
          height='80px'
          colorScheme="red"
          bg='#2E8B57'
          borderRadius='10px'
          fontSize='small'
          margin='20px'
          maxWidth= '70%'
        >
          <AlertIcon boxSize='30px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {successMessage}
          </AlertTitle>
        </Alert>
      )}

        <div className="gemini-icon-container">
          
          <div className="gicon-title">
            <img alt="ai logo" className="blogAI-icon" src="blog-ai.png" />
            <h1>PlagGuard AI</h1>
          </div>

          <div className="gicon-powered">
            <img alt="gemini logo" className="gemini-icon" src="google-gemini-icon.png" />
            <p>Gemini 1.5 Powered</p>
          </div>
        </div>

        <p>PlagGuard is an advanced Gemini 1.5 powered tool designed to help you create plagiarism free content. PlagGuard not only detects potential plagiarism in your text but also provides intelligent suggestions and edits to ensure your work is authentic.</p>

        <div className="search-container">
          <input value={text} onChange={handleTextChange} type="text" placeholder="Enter a text" className="search-input" />
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
              <img alt="ai" className="toolbar-icon" src="blog-ai.png" />
              <button className='copy-btn' onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(rewrittenText)
                  .then(() => {
                    setSuccessMessage("Copied to clipboard");
                    onOpenSuccess(); 
                  })
                  .catch(err => {
                    console.error('Failed to copy text:', err);
                  });
              }}><span className="material-symbols-outlined">content_copy</span></button>
            </div>
            <p>{rewrittenText}</p>
          </div>
        )}

      </form>
    </>
  );
}
