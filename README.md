# pdf-from

Easily generate full-featured PDF files from HTML and other web formats

<!-- [START badges] -->
[![NPM Version](https://img.shields.io/npm/v/pdf-from.svg)](https://www.npmjs.com/package/pdf-from)
[![Node Requirement](https://img.shields.io/node/v/pdf-from.svg)](https://www.npmjs.com/package/pdf-from)
[![License](https://img.shields.io/npm/l/pdf-from.svg)](https://github.com/skiplist-eng/pdf-from/blob/master/LICENSE)
[![Number of Downloads](https://img.shields.io/npm/dm/pdf-from.svg)](https://www.npmjs.com/package/pdf-from) 
<!-- [END badges] -->

This package is for rendering PDF files on the server, not on the client. If any resources are not accessible to the server, then they will not be included in the resulting PDF.

## Installation  

To use pdf-from in your Node app:  

### npm

```bash
npm install --save pdf-from
```

### yarn

```bash
yarn add pdf-from
```

## Usage

### PDF from Html

#### Basic Example

```js
const pdfFrom = require("pdf-from");

const htmlString = `
<html>
    <body>
        <h1>Hello PDF</h1>
        <p>This is a PDF</p>
    </body>
</html>
`
await pdfFrom.html(htmlString);
```

#### Express Example

This example renders a template, converts the resulting HTML to a PDF, and then sends the PDF back to the browser.

```js
const pdfFrom = require("pdf-from");

const template = "my_pug_template";
res.render(template, structuredData, (err, htmlString) => {
    const applicationPdf = await pdfFrom.html(htmlString);
    if (applicationPdf && Buffer.isBuffer(applicationPdf)) {
        res.type("application/pdf");
        res.send(applicationPdf);
    } else {
        res.status(404).send("PDF not found");
    }
});
```

#### Example of Changing PDF Options

```js
const pdfFrom = require("pdf-from");

const htmlString = `
<html>
    <body>
        <h1>Hello PDF</h1>
        <p>This is a PDF</p>
    </body>
</html>
`
await pdfFrom.html(htmlString, {
    displayHeaderFooter: true,
    headerTemplate:
        "<span class='title'></span> - <span class='date'></span>"
    footerTemplate:
        "<span class='pageNumber'></span> of <span class='totalPages'></span>",
    format: "Legal",
    landscape: true,
    margin: {
        top: '100px',
        right: '20px',
        bottom: '10px',
        left: '20px'
    },
    scale: 1.25
});
```

#### Available Options

- `wrapOutput` normally a buffer is returned with the raw PDF data, this switch causes the PDF data to be wrapped in an object: `{ pdf: [Buffer] }`
- `useScreenMedia` normally the print styles will be used if they are available, this switch causes any print styles to be ignored

The package also respects all of the [Puppeteer PDF rendering options](https://pptr.dev/#?product=Puppeteer&version=v1.5.0&show=api-pagepdfoptions).

## Caveats

### Docker

The default [node Docker image](node docker image yarn) does not come bundled with all the libraries required by this package, they have to be added manually. The following needs to be added to your Dockerfile

```docker
# Install Chromium dependencies
RUN apt-get update && \
    apt-get install -yq \
        ca-certificates \
        fonts-liberation \
        gconf-service \
        libappindicator1 \
        libappindicator3-1 \
        libasound2 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgcc1 \
        libgconf-2-4 \
        libgdk-pixbuf2.0-0 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libstdc++6 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        lsb-release \
        xdg-utils wget
```
