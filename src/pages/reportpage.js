import React, { useState } from "react";
import Footer from "../footer";

export default function ReportPost() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [reportType, setReportType] = useState('');
  const [postInfo] = useState(() => {
    const storedPostInfo = localStorage.getItem('postInfo');
    return storedPostInfo ? JSON.parse(storedPostInfo) : null;
  });

  const author = postInfo?.author?.username || '';
  const postName = postInfo?.title || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API_URL}/report`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, query, reportType, author, postName}),
      });
      
      if (response.ok) {
        alert('Form submitted successfully');
      } else {
        alert('Form submission failed');
      }
    } catch (error) {
      alert('Error submitting form: ' + error.message);
    }

  };

  return (
    <>
      <form className="report" onSubmit={handleSubmit}>
        <h1>Help Center</h1>

        <input
          style={{ color: '#6DCAAE', cursor: "not-allowed" }}
          className="disabled-input"
          type="text"
          value={postInfo.author.username}
          disabled
        />

        <input
          style={{ color: '#6DCAAE', cursor: "not-allowed" }}
          className="disabled-input"
          type="text"
          value={postInfo.title}
          disabled
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          required 
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />

        <select value={reportType} onChange={(ev) => setReportType(ev.target.value)} required>
          <optgroup>
            <option disabled value="">Why are you reporting this?</option>
            <option>It's spam</option>
            <option>Nudity or sexual content</option>
            <option>Hate speech</option>
            <option>Violence or dangerous content</option>
            <option>Sale of illegal goods</option>
            <option>Intellectual property violation</option>
            <option>Drugs</option>
            <option>False information</option>
            <option>Scam or fraud</option>
          </optgroup>
        </select>

        <textarea
          type="text"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)} 
          required
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Reporting Guidelines:</h3>
            <p>If you believe that content on our platform violates our community guidelines, please report it to us. We take reports seriously and will review them carefully.</p>
          <h3>Community Guidelines:</h3>
            <p>*Create respectful content - no explicit or offensive material, support for illegal activities, or piracy links. Respect user privacy, engage in civil communication, and report violations for a positive community. Violations may lead to content removal or account actions.</p>
          <h3>Action Upon Violation:</h3>
            <p>When a report matches our guidelines and we find that a user has violated our community guidelines, we will take appropriate action.</p>
          <ul>
             <li>Content violating guidelines will be removed.</li>
             <li>Repeat offenders may face account restrictions or bans.</li>
             <li>We strive to maintain a safe and respectful community and appreciate your cooperation in upholding these standards.</li>
          </ul>
          <p>For further</p>
        <Footer/>
      </div>
    </>
  );
}
