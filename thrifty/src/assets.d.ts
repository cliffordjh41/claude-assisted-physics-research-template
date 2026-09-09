// Ambient declaration for bundler `?url` asset imports. Lets the library
// type-check on its own without pulling in all of `vite/client`'s ambient
// types — consumers' bundlers (Vite, etc.) resolve the emitted URL at build
// time.
declare module "*?url" {
  const src: string
  export default src
}
