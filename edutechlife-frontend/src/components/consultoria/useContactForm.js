import { useState } from 'react';

export default function useContactForm(t) {
  const [contactForm, setContactForm] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    tamano: '',
    servicio: '',
    mensaje: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!contactForm.nombre.trim()) errors.nombre = t('consultoria.error_name');
    if (!contactForm.empresa.trim()) errors.empresa = t('consultoria.error_company');
    if (!contactForm.email.trim()) {
      errors.email = t('consultoria.error_email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = t('consultoria.error_email_invalid');
    }
    if (!contactForm.telefono.trim()) {
      errors.telefono = t('consultoria.error_phone');
    } else if (!/^[0-9+\s-]{7,15}$/.test(contactForm.telefono)) {
      errors.telefono = t('consultoria.error_phone_invalid');
    }
    if (!contactForm.servicio) errors.servicio = t('consultoria.error_service');
    if (!contactForm.mensaje.trim()) errors.mensaje = t('consultoria.error_message');
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitted(true);
  };

  return { contactForm, setContactForm, submitted, setSubmitted, formErrors, setFormErrors, handleSubmit };
}
