export const content = ["./src/**/*.{astro,html,svelte,vue,js,ts,jsx,tsx}"];
export const plugins = [require("daisyui")];
export const daisyui = {
  themes: [
    {
      light: {
        primary: "#392060",
        secondary: "#b68aef",
        accent: "#c39bf8",
        neutral: "#251537",
        "base-100": "#f2edf8",
      },
      dark: {
        primary: "#b99fdf",
        secondary: "#3c1075",
        accent: "#2f0764",
        neutral: "#251537",
        "base-100": "#0c0712",
      },
    },
  ],
};
