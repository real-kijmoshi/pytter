/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050509",
          base: "#050509",
        },
        surface: {
          DEFAULT: "#0e0e17",
          raised: "#141420",
          overlay: "#1a1a2a",
          glass: "rgba(14,14,23,0.85)",
        },
        border: {
          DEFAULT: "#1e1e2e",
          subtle: "#13131d",
          highlight: "#2a2a3e",
          focus: "#7c3aed",
        },
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          muted: "rgba(124,58,237,0.15)",
          bright: "#8b5cf6",
        },
        pink: {
          DEFAULT: "#ec4899",
          hover: "#db2777",
          muted: "rgba(236,72,153,0.15)",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#475569",
          placeholder: "#334155",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "logo-gradient": "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
        "accent-gradient": "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.15), transparent)",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "fade-in-fast": "fadeIn 0.15s ease-out",
        "slide-up": "slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "heart-pop": "heartPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "shimmer": "shimmer 1.8s infinite linear",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        heartPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.5)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        "glow-violet": "0 0 24px rgba(124,58,237,0.3)",
        "glow-violet-lg": "0 0 40px rgba(124,58,237,0.2), 0 0 80px rgba(124,58,237,0.1)",
        "glow-pink": "0 0 20px rgba(236,72,153,0.3)",
        "card": "0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)",
        "dropdown": "0 12px 40px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)",
        "input-focus": "0 0 0 3px rgba(124,58,237,0.2)",
        "button": "0 2px 8px rgba(124,58,237,0.4)",
        "button-hover": "0 4px 16px rgba(124,58,237,0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
