import * as React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  priority?: boolean;
}

/**
 * ParaCompanion Brand Logo component.
 * Renders the official hexagonal logo from the public assets.
 */
export function BrandLogo({ className, size = 32, priority = false }: BrandLogoProps) {
  return (
    <img
      src="/brand/logo.png"
      alt="ParaCompanion Logo"
      className={className}
      style={{ 
        width: size, 
        height: "auto",
        display: "block"
      }}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
