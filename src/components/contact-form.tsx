"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "523316036983";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir el mensaje para WhatsApp
    const whatsappMessage = `Hola, soy ${formData.name}.\n\nMensaje: ${formData.message}`;

    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva ventana/pestaña
    window.open(whatsappUrl, "_blank");

    // Limpiar el formulario después de enviar
    setFormData({ name: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex-1 space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-8">
      <h3 className="text-lg font-semibold">¿Listo para comenzar?</h3>
      <p className="text-sm text-slate-200">
        Envíanos un mensaje y te responderemos en menos de 5 minutos. Te
        contactamos el mismo día hábil.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors resize-none"
            placeholder="Cuéntanos sobre tu proyecto..."
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-[#662d91] px-8 py-6 text-base font-medium text-white hover:bg-[#7a3aa3] transition-colors"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Enviar por WhatsApp
        </Button>
      </form>

      <div className="space-y-3 text-sm text-slate-300">
        <p className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Auditoría técnica sin costo para nuevos clientes
        </p>
        <p className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Planes de financiamiento y leasing disponibles
        </p>
        <p className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Onboarding y capacitación incluidos
        </p>
      </div>
    </div>
  );
};

