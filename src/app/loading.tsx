import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950">
      <div className="relative mb-8">
        <div className="absolute -inset-8 rounded-full bg-[#662d91]/40 blur-3xl opacity-80" />
        <div className="relative flex items-center justify-center rounded-3xl bg-slate-900/60 px-10 py-6 border border-purple-500/40 shadow-[0_0_40px_rgba(102,45,145,0.7)]">
          <Image
            src="/logo/p.png"
            alt="Pixel3D logo"
            width={80}
            height={80}
            className="h-14 w-14 object-contain"
          />
          <span className="ml-4 text-xl font-semibold tracking-tight text-white">
            Pixel3D
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-200">
        <span className="inline-flex h-4 w-4 items-center justify-center">
          <span className="h-4 w-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
        </span>
        <span className="text-slate-200/80">
          Preparando tu experiencia de impresión 3D...
        </span>
      </div>
    </div>
  );
}


