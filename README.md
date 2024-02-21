# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.hlx.page/
- Live: https://main--{repo}--{owner}.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```
## Run sass auto-compile and Helix Pages
```sh
npm run up
```

The above command will run `node sass-compile.js` in parallel with `hlx up` which will start your local Helix Pages development environment.

### Note on SASS usage and Helix Local Development

 The `npm run up` will parse the `styles` and `blocks` directory for any `.scss` files. Files that are found will be compiled to css and saved in the same location and name with a `.css` extension. It will then continue to watch for changes to `.scss` files and will compile to their associated CSS files on changes.

Examples: 
  - `{repo}/blocks/header/header.scss` will compile to `{repo}/blocks/header/header.css`
  - `{repo}/styles/style.scss` will compile to `{repo}/styles/styles.css`

As both `sass-compile.js` and `hlx up` are watching for changes, changes made to your sass files while using the `rpm run up` command will be reflected automatically in your localhost. 

Note that using only the `hlx up` command will not trigger updates on-change for sass files.

## Postcss-sass
1. [postcss](https://github.com/postcss/postcss#syntaxes) [postcss-sass](https://github.com/postcss/postcss-scss)
2. Plugins:
  - [autoprefixer] (https://github.com/postcss/autoprefixer)
  - [postcss-strip-inline-comments](https://github.com/mummybot/postcss-strip-inline-comments) enable remove `// comment or code` from compiled css files.

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
3. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
4. Start Franklin Proxy: `hlx up --url https://main--my-website--shinycai.hlx.page/` (opens your browser at `http://localhost:3000`) or `hlx up --port [3333] --url https://main--my-website--shinycai.hlx.page/` to custom port`
5. Open the `{repo}` directory in your favorite IDE and start coding :)
6. dev-units branch environment: `https://dev-units--my-website--shinycai.hlx.page/`

## Commonly Used File and Folder Structure
    | styles
      | styles.css 
      | lazy-styles.scss (loaded after LCP event)
      | ...
    | scripts
      | scripts.js
      | lib-franklin.js
      | delayed.js (other libraries)
      | ...
    | icons
      | xx.svg

  - https://www.hlx.live/developer/block-collection/icons
  - can be referenced with a `:<iconname>:` notation; 
  - can be styled with CSS, without having to create SVG symbols
  - It will not be effective if font is `Courier New` that unusual text font but code.
  
## Custom Block Party:
 - Image with links: 
   - [Codes](https://github.com/hlxsites/wgf-pga-tour/blob/86dadfc5720a3e097fd7b354c007e61fed4b722f/blocks/header/header.js#L20-L39 )
   - [Preview](https://main--wgf-pga-tour--hlxsites.hlx.page/footer?view-doc-source=true)

## sitemap
sitemaps:
  <!-- # default: en
  #  example:
  #    languages:
  #      en:
  #        source: /en/query-index.json
  #        destination: /sitemap-en.xml
  #        hreflang: en
  #      tc:
  #        source: /tc/query-index.json
  #        destination: /sitemap-tc.xml
  #        hreflang: tc -->
  example:
     origin: https://www.alopecia.com
     source: /query-index.json
     destination: /sitemap.xml