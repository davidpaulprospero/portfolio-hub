/**
 * Tailwind v4 runs as a PostCSS plugin.
 *
 * This file is required because the build runs with `--no-turbopack`. Without
 * it, `@import "tailwindcss"` passes through unprocessed and the site ships
 * with no utility classes at all - and the build still reports success, so
 * this failure is invisible until you look at the CSS.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;