{/* Cores do Site ImovLife */}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        skyline: {
          dark: '#0f172a',      
          card: '#1e293b',      
          accent: '#5b89a6',    
          accentHover: '#7ea4bc',
          textMain: '#f8fafc',  
          textMuted: '#94a3b8', 
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'], 
      }
    }
  }
}