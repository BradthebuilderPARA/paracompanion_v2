/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,tsx,mdx}",
    "./pages/**/*.{js,ts,tsx,mdx}",
    "./components/**/*.{js,ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0066ff", // Action Blue as primary for easier usage
        "primary-focused": "#0050cb",
        "primary-container": "#0066ff",
        "on-primary": "#ffffff",
        "surface": "#f7f9fb",
        "surface-container-low": "#f2f4f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#e0e3e5",
        "on-surface": "#191c1e",
        "on-surface-variant": "#424656",
        "outline-variant": "rgba(194, 198, 216, 0.2)",
        "emergency": "#DC2626",
        "brand-green": "#10b981",
        "brand-black": "#000000",
      },
      fontFamily: {
        "headline": ["var(--font-inter)", "sans-serif"],
        "body": ["var(--font-inter)", "sans-serif"],
        "technical": ["var(--font-space-grotesk)", "monospace"],
        "label": ["var(--font-space-grotesk)", "monospace"]
      },
      borderRadius: {
        "none": "0",
        "DEFAULT": "0.25rem",
        "sm": "0.25rem", // Force 4px everywhere if requested
        "md": "0.25rem",
        "lg": "0.25rem",
        "xl": "0.25rem",
        "full": "9999px"
      },
      boxShadow: {
        "telemetry": "0px 12px 32px rgba(25, 28, 30, 0.04)"
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
