"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollAnimate = ({
  children,
  className,
  delay = 0,
}: ScrollAnimateProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            // No desconectamos para evitar que se resetee si el usuario hace scroll hacia arriba
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95",
        className
      )}
    >
      {children}
    </div>
  );
};

