/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
          extend: {
                  colors: {
                            klarifi: {
                                        50: '#EEF7FF',
                                        100: '#D9EDFF',
                                        200: '#BBE0FF',
                                        300: '#8BCCFF',
                                        400: '#5BB8F5',
                                        500: '#2B8CDB',
                                        600: '#1A6FB8',
                                        700: '#155A96',
                                        800: '#154B7C',
                                        900: '#173F67',
                            }
                  },
                  fontFamily: {
                            sans: ['DM Sans', 'system-ui', 'sans-serif'],
                            display: ['Instrument Serif', 'Georgia', 'serif'],
                  }
          },
    },
    plugins: [],
}
