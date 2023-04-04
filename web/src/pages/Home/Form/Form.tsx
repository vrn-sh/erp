import React, { useState } from 'react';
import './Form.scss';

export default function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Perform desired actions with the form data
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    // Clear form fields
    setName('');
    setEmail('');
    setMessage('');

    alert("Form submitted!");
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />

      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label htmlFor="message">Message:</label>
      <textarea id="message" name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>

      <button type="submit">Submit</button>
    </form>
  );
}
