"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Heading } from "@/components/ui/heading"

const WHATSAPP_NUMBER = "523351969175"

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const whatsappMessage = `Hola, soy ${formData.name}.\n\nMensaje: ${formData.message}`
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setFormData({ name: "", message: "" })
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div className="flex-1 space-y-6 rounded-[24px] bg-dark-charcoal p-8">
      <Heading as="h3" size="sm">
        ¿Listo para comenzar?
      </Heading>
      <p className="text-sm leading-relaxed text-fog">
        Envíanos un mensaje y te respondemos el mismo día hábil.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
            aria-label="Nombre"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Cuéntanos sobre tu proyecto..."
            aria-label="Mensaje"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Enviar por WhatsApp
        </Button>
      </form>
    </div>
  )
}
