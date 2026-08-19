/**
 * Maps every seeded language name → devicon CSS class string.
 * Usage: <i className={devicons[logsData.language.name]} />
 *
 * Devicon reference: https://devicon.dev
 */
export const devicons: Record<string, string> = {
  // Angular
  "angular-html": "devicon-angular-plain colored",
  "angular-ts": "devicon-angular-plain colored",

  // Astro
  astro: "devicon-astro-plain colored",

  // Shell / Bash / Zsh
  bash: "devicon-bash-plain colored",
  sh: "devicon-bash-plain colored",
  shell: "devicon-bash-plain colored",
  shellscript: "devicon-bash-plain colored",
  zsh: "devicon-bash-plain colored",

  // Blade (Laravel templates)
  blade: "devicon-laravel-plain colored",

  // C / C++
  c: "devicon-c-plain colored",
  "c++": "devicon-cplusplus-plain colored",
  cpp: "devicon-cplusplus-plain colored",

  // CoffeeScript
  coffee: "devicon-coffeescript-original colored",
  coffeescript: "devicon-coffeescript-original colored",

  // CSS / PostCSS
  css: "devicon-css3-plain colored",
  postcss: "devicon-css3-plain colored",

  // CSV — no devicon; use a plain file icon
  csv: "devicon-filetype-csv",

  // TypeScript variants
  cts: "devicon-typescript-plain colored",
  mts: "devicon-typescript-plain colored",
  ts: "devicon-typescript-plain colored",
  "ts-tags": "devicon-typescript-plain colored",
  typescript: "devicon-typescript-plain colored",

  // GLSL — no devicon; use generic code icon
  glsl: "devicon-opengl-plain",

  // GraphQL
  gql: "devicon-graphql-plain colored",
  graphql: "devicon-graphql-plain colored",

  // HAML (Ruby templating)
  haml: "devicon-ruby-plain colored",

  // Handlebars
  handlebars: "devicon-handlebars-original colored",
  hbs: "devicon-handlebars-original colored",

  // HTML
  html: "devicon-html5-plain colored",
  "html-derivative": "devicon-html5-plain colored",

  // HTTP / Hurl — no devicon
  http: "devicon-chrome-plain colored",
  hurl: "devicon-chrome-plain colored",

  // Imba — no devicon
  imba: "devicon-javascript-plain colored",

  // Jade / Pug
  jade: "devicon-jade-plain colored",
  pug: "devicon-jade-plain colored",

  // Java
  java: "devicon-java-plain colored",

  // JavaScript variants
  cjs: "devicon-javascript-plain colored",
  js: "devicon-javascript-plain colored",
  javascript: "devicon-javascript-plain colored",
  mjs: "devicon-javascript-plain colored",

  // Jinja
  jinja: "devicon-jinja-original colored",

  // Jison — no devicon
  jison: "devicon-javascript-plain colored",

  // Julia
  jl: "devicon-julia-plain colored",
  julia: "devicon-julia-plain colored",

  // JSON variants — no dedicated devicon icon; use plain text icon
  json: "devicon-json-plain colored",
  json5: "devicon-json-plain colored",
  jsonc: "devicon-json-plain colored",
  jsonl: "devicon-json-plain colored",

  // JSX / TSX (React)
  jsx: "devicon-react-original colored",
  tsx: "devicon-react-original colored",

  // Less
  less: "devicon-less-plain-wordmark colored",

  // Lit — no devicon
  lit: "devicon-javascript-plain colored",

  // Markdown
  markdown: "devicon-markdown-original colored",
  marko: "devicon-markdown-original colored",
  md: "devicon-markdown-original colored",
  mdc: "devicon-markdown-original colored",
  mdx: "devicon-markdown-original colored",

  // PHP
  php: "devicon-php-plain colored",

  // Python
  py: "devicon-python-plain colored",
  python: "devicon-python-plain colored",

  // R
  r: "devicon-r-plain colored",

  // Regex — no devicon
  regex: "devicon-javascript-plain colored",
  regexp: "devicon-javascript-plain colored",

  // Sass / SCSS
  sass: "devicon-sass-original colored",
  scss: "devicon-sass-original colored",

  // SQL
  sql: "devicon-azuresqldatabase-plain colored",

  // Stylus
  styl: "devicon-stylus-original colored",
  stylus: "devicon-stylus-original colored",

  // Svelte
  svelte: "devicon-svelte-plain colored",

  // Vue
  vue: "devicon-vuejs-plain colored",
  "vue-html": "devicon-vuejs-plain colored",
  "vue-vine": "devicon-vuejs-plain colored",

  // WebAssembly
  wasm: "devicon-wasm-plain colored",

  // WGSL / WIT — no devicon
  wgsl: "devicon-opengl-plain",
  wit: "devicon-opengl-plain",

  // XML
  xml: "devicon-xml-plain colored",

  // YAML
  yaml: "devicon-yaml-plain colored",
  yml: "devicon-yaml-plain colored",
};
