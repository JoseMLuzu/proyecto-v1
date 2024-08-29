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
            <h2 className="contact-title">Our Emial </h2>
            <h3 className="contact-description">fintrack@gmail.com</h3>
        </div>
    );
};
