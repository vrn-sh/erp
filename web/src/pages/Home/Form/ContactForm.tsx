/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormWrapper = styled.div`
  width: 400px;
  padding: 5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #333333;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: #495057;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #495057;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission here
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Contact Us</Title>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="message">Message</Label>
            <TextArea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
            />
            </InputGroup>

          <Button type="submit">Submit</Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default ContactForm;
``
