"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "../../store/cart-store";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 54);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto rounded-2xl backdrop-blur-sm border transition-all duration-300 shadow-lg",
          isScrolled
            ? " supports-[backdrop-filter]:bg-white/60"
            : "bg-white/10 border-white/10"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo P y Pixel3D juntos - Izquierda */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo/p.png"
              width={40}
              height={40}
              alt="Pixel P logo"
              className="w-10 h-10"
            />
            <Image
              src={isScrolled ? "/logo/pixel3d.png" : "/logo/pixel3d-w.png"}
              width={140}
              height={35}
              alt="Pixel3D logo"
              className="h-6 w-auto"
            />
          </Link>

          {/* Navegación y acciones - Centro/Derecha */}
          <div className="hidden md:flex items-center gap-8">
            {/* Link de navegación */}
            <Link
              href="/products"
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                isScrolled
                  ? "text-slate-700 hover:text-purple-700"
                  : "text-white hover:text-purple-600"
              )}
            >
              Productos
            </Link>

            {/* Redes sociales */}
            <div className="flex items-center gap-4">
              <Link
                href="https://www.instagram.com/pixel3dmx/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                <Image
                  src="/logo/insta.png"
                  alt="Instagram"
                  width={20}
                  height={20}
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isScrolled
                      ? "opacity-70 hover:opacity-100"
                      : "opacity-90 hover:opacity-100"
                  )}
                />
              </Link>
              <Link
                href="https://www.tiktok.com/@pixel3d83"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                <Image
                  src="/logo/tiktok.png"
                  alt="TikTok"
                  width={20}
                  height={20}
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isScrolled
                      ? "opacity-70 hover:opacity-100"
                      : "opacity-90 hover:opacity-100"
                  )}
                />
              </Link>
            </div>

            {/* Carrito */}
            <Link href="/checkout" className="relative">
              <ShoppingCartIcon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isScrolled
                    ? "text-slate-700 hover:text-purple-700"
                    : "text-white hover:text-purple-600"
                )}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Menú móvil - Derecha */}
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/checkout" className="relative">
              <ShoppingCartIcon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isScrolled
                    ? "text-slate-700 hover:text-purple-700"
                    : "text-white"
                )}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              className={cn(
                isScrolled
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/20"
              )}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div
          className={cn(
            "md:hidden mt-2 mx-auto max-w-7xl px-4 rounded-2xl border shadow-lg",
            isScrolled
              ? "bg-white/95 backdrop-blur-md border-slate-200/50"
              : "bg-white/40 backdrop-blur-md border-white/30"
          )}
        >
          <ul className="flex flex-col p-4 space-y-3">
            <li>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-xl transition-colors",
                  isScrolled
                    ? "text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                    : "text-slate-800 hover:bg-white/20"
                )}
              >
                Productos
              </Link>
            </li>
            <li className="pt-3 border-t border-slate-300/30">
              <div className="flex items-center gap-4 px-4">
                <Link
                  href="https://www.instagram.com/pixel3dmx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/logo/insta.png"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      isScrolled ? "text-slate-700" : "text-slate-800"
                    )}
                  >
                    Instagram
                  </span>
                </Link>
                <Link
                  href="https://www.tiktok.com/@pixel3d83"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/logo/tiktok.png"
                    alt="TikTok"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      isScrolled ? "text-slate-700" : "text-slate-800"
                    )}
                  >
                    TikTok
                  </span>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
