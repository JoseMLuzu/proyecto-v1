import React, { useState } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/contact.css";

export const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const { actions } = useContext(Context); // Obtén las acciones del contexto

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await actions.sendContactMessage(formData.name, formData.email, formData.message);
        
        if (result.success) {
            alert(result.message); // O muestra un mensaje de éxito en la UI
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        } else {
            alert(result.message); // O muestra un mensaje de error en la UI
        }
    };

    return (
        <div className="container contact-container my-5">
            <h2 className="contact-title">Contact Us</h2>
            <p className="contact-description">We'd love to hear from you! Please fill out the form below and we'll get in touch with you as soon as possible.</p>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="form-control"
                        value={formData.subject}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Send Message</button>
            </form>
        </div>
    );
};
