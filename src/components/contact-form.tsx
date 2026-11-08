"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { whatsappUrl as buildWhatsappUrl } from "@/lib/contact"

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const whatsappMessage = `Hola, soy ${formData.name}.\n\nMensaje: ${formData.message}`
    window.open(buildWhatsappUrl(whatsappMessage), "_blank")
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
    <div className="space-y-5 rounded-[20px] border border-line bg-panel p-6 sm:p-8">
      <div>
        <h3 className="font-display text-xl font-bold">Mándanos un mensaje</h3>
        <p className="mt-1.5 text-sm text-fog">
          Se abre WhatsApp con tu mensaje listo para enviar.
        </p>
      </div>

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
            placeholder="Ej. Quiero 20 llaveros con el logo de mi equipo"
            aria-label="Mensaje"
            rows={5}
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Enviar por WhatsApp
        </Button>
      </form>
    </div>
  )
}
