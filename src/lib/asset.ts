/** Resolves a public/ asset against Vite's base (needed for GitHub Pages sub-path hosting). */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, "");
