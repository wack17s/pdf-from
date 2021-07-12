const fs = require("fs");
const tmp = require("tmp");
const puppeteer = require("puppeteer");

class pdfFrom {
    static _setDefaults() {
        // pdf-from options

        // return { pdf: [Buffer] } rather than the raw buffer
        this.wrapOutputValues = [true, false];
        this.wrapOutput = false;

        // use screen CSS rather than print CSS
        this.useScreenMediaValues = [true, false];
        this.useScreenMedia = false;

        // Puppeteer page.pdf options

        this.scale = 1.0;

        this.displayHeaderFooterValues = [true, false];
        this.displayHeaderFooter = false;

        this.headerTemplate = "";
        this.footerTemplate = "";

        this.printBackgroundValues = [true, false];
        this.printBackground = false;

        this.landscapeValues = [true, false];
        this.landscape = false;

        this.pageRanges = "";

        this.formatValues = ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"];
        this.format = "Letter";

        this.width = "";
        this.height = "";
        this.margin = "30px";
    }

    static _parseOptions(options) {
        this._setDefaults();
        
        if (!options) {
            return;
        }

        if (options.wrapOutput && this.wrapOutputValues.includes(options.wrapOutput)) {
            this.wrapOutput = options.wrapOutput;
        }

        if (options.wrapOutput && this.wrapOutputValues.includes(options.wrapOutput)) {
            this.wrapOutput = options.wrapOutput;
        }

        if (options.scale && (!isNaN(parseFloat(options.scale)) && isFinite(options.scale)) && (options.scale > 0.1 && options.scale < 2.0)) {
            this.scale = options.scale;
        }

        if (options.displayHeaderFooter && this.displayHeaderFooterValues.includes(options.displayHeaderFooter)) {
            this.displayHeaderFooter = options.displayHeaderFooter;
        }

        if (options.headerTemplate) {
            this.headerTemplate = options.headerTemplate;
        }

        if (options.footerTemplate) {
            this.footerTemplate = options.footerTemplate;
        }

        if (options.printBackground && this.printBackgroundValues.includes(options.printBackground)) {
            this.printBackground = options.printBackground;
        }

        if (options.landscape && this.landscapeValues.includes(options.landscape)) {
            this.landscape = options.landscape;
        }

        if (options.pageRanges) {
            this.pageRanges = options.pageRanges;
        }

        if (options.format && this.formatValues.includes(options.format)) {
            this.format = options.format;
        }

        if (options.width) {
            this.width = options.width;
        }

        if (options.height) {
            this.height = options.height;
        }

        if (options.margin) {
            this.margin = options.margin;
        }
    }

    static async html(htmlData, options={}) {
        this._parseOptions(options);
        const htmlString = await htmlData;

        let tmpHtmlFile = tmp.fileSync({ postfix: ".html" });
        fs.writeFileSync(tmpHtmlFile.name, htmlString);
        let buffer = {};

        const browser = await puppeteer.launch({
            args: ["--disable-setuid-sandbox", "--no-sandbox"]
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        try {
            await page.goto(`file://${tmpHtmlFile.name}`, {
                waitUntil: "networkidle2"
            });
            if (this.useScreenMedia) {
                await page.emulateMedia('screen');
            }
            buffer = await page.pdf({
                scale: this.scale,
                displayHeaderFooter: this.displayHeaderFooter,
                headerTemplate: this.headerTemplate,
                footerTemplate: this.footerTemplate,
                printBackground: this.printBackground,
                landscape: this.landscape,
                pageRanges: this.pageRanges,
                format: this.format,
                width: this.width,
                height: this.height,
                margin: this.margin
            });
        } catch (error) {
            console.error(`Chrome failed to process ${tmpHtmlFile.name}\n${error}`);
        }
        tmpHtmlFile.removeCallback();

        await browser.close();

        if (this.wrapOutput) {
            return { pdf: buffer };
        } else {
            return buffer;
        }
    };
}

module.exports = pdfFrom;
