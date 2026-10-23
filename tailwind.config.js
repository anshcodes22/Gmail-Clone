/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gmail: {
          bg: '#f6f8fc',
          surface: '#ffffff',
          sidebarHover: '#eaebef',
          activePill: '#d3e3fd',
          activeText: '#041e49',
          border: '#e0e3e7',
          grayText: '#444746',
          mutedText: '#5f6368',
          hoverRow: '#f2f6fc',
          selectedRow: '#c2dbff',
          unread: '#1f1f1f',
          read: '#444746',
          composeBtn: '#c2e7ff',
          composeBtnHover: '#b3d7ef',
          primaryTab: '#0b57d0',
          promotionsTab: '#188038',
          socialTab: '#1a73e8',
          updatesTab: '#e37400'
        }
      },
      fontFamily: {
        sans: ['Google Sans', 'Roboto', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
