import { Button } from "@/components/ui/button"
import { whatsappUrl } from "@/lib/contact"

const STEPS = [
  {
    title: "Escríbenos",
    body: "Mándanos tu idea o una foto por WhatsApp y te cotizamos el mismo día.",
  },
  {
    title: "Diseñamos",
    body: "Te enviamos un render para aprobar colores y medidas antes de imprimir.",
  },
  {
    title: "Imprimimos",
    body: "Producción en 3 a 5 días, con acabado y revisión pieza por pieza.",
  },
  {
    title: "Enviamos",
    body: "Recibes tu guía de rastreo por correo para seguir tu paquete.",
  },
]

export const CustomOrderSteps = () => {
  return (
    <div className="space-y-10">
      <ol className="grid gap-6 min-[440px]:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className={
              index === 0
                ? "flex flex-col gap-2 border-t-2 border-blurple pt-4"
                : "flex flex-col gap-2 border-t-2 border-line pt-4"
            }
          >
            <span className="font-mono text-xs font-semibold text-blurple">
              Paso {index + 1}
            </span>
            <h3 className="font-display text-base font-bold tracking-[-0.01em]">
              {step.title}
            </h3>
            <p className="text-[15px] text-fog">{step.body}</p>
          </li>
        ))}
      </ol>
      <Button asChild size="lg">
        <a
          href={whatsappUrl("Hola, quiero cotizar una pieza personalizada.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cotizar por WhatsApp
        </a>
      </Button>
    </div>
  )
}
