import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import styles from './ContactForm.module.scss';

interface FormData {
    name: string;
    email: string;
    message: string;
}

function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        emailjs
            .sendForm(
                import.meta.env.VITE_REACT_APP_SERVICE_ID_CONTACT_FORM,
                import.meta.env.VITE_REACT_APP_TEMP_ID_CONTACT_FORM,
                e.target,
                import.meta.env.VITE_REACT_APP_PUBLIC_KEY_CONTACT_FORM
            )
            .catch((error) => {
                throw error;
            });
    };

    return (
        <div id="contact" className={styles.container}>
            <div className={styles.formWrapper}>
                <h2 className={styles.title}>Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="name">
                            Name
                        </label>
                        <input
                            className={styles.input}
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="email">
                            Email
                        </label>
                        <input
                            className={styles.input}
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="message">
                            Message
                        </label>
                        <textarea
                            className={styles.textArea}
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        className={styles.button}
                        type="submit"
                        value="Send"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;
