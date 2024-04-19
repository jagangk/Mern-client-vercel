import { useState } from "react";
import Footer from "../footer";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${process.env.REACT_APP_API_URL}/contact`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, query }),
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
    <><form className="login" onSubmit={handleSubmit}>
      <h1>Let's Connect!</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(ev) => setName(ev.target.value)} />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)} />

      <textarea
        type="text"
        value={query}
        onChange={(ev) => setQuery(ev.target.value)} />
      <button>Submit</button>
    </form><div>
      <Footer />
      </div></>
  );
}

