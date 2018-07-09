const chai = require("chai");
const expect = chai.expect;

const pdfFrom = require('../src/pdfFrom');

describe('pdfFrom', () => {
    it('should create a pdf', async () => {
        const htmlData = '<html><body><h1>Hello PDF</h1><p>This is a PDF file</p></body></html>';
        const pdfData = await pdfFrom.html(htmlData);

        expect(Buffer.isBuffer(pdfData)).to.be.true;
        expect(pdfFrom.displayHeaderFooter).to.be.false;
        expect(pdfFrom.format).to.equal("Letter");
        expect(pdfFrom.landscape).to.be.false;
        expect(pdfFrom.printBackground).to.be.false;
        expect(pdfFrom.margin).to.equal("30px");
        expect(pdfFrom.scale).to.equal(1.0);
    });

    it('should create a pdf with options', async () => {
        const htmlData = '<html><body><h1>Hello PDF</h1><p>This is a PDF file</p></body></html>';
        const pdfData = await pdfFrom.html(htmlData, {
            displayHeaderFooter: true,
            format: "Legal",
            landscape: true,
            printBackground: true,
            margin: "50px",
            scale: 1.25
        });

        expect(Buffer.isBuffer(pdfData)).to.be.true;
        expect(pdfFrom.displayHeaderFooter).to.be.true;
        expect(pdfFrom.format).to.equal("Legal");
        expect(pdfFrom.landscape).to.be.true;
        expect(pdfFrom.printBackground).to.be.true;
        expect(pdfFrom.margin).to.equal("50px");
        expect(pdfFrom.scale).to.equal(1.25);
    });

    it('should create a pdf wrapped in an object', async () => {
        const htmlData = '<html><body><h1>Hello PDF</h1><p>This is a PDF file</p></body></html>';
        const pdfData = await pdfFrom.html(htmlData, {wrapOutput: true});

        expect(pdfData).to.be.an.instanceof(Object);
        expect(Buffer.isBuffer(pdfData.pdf)).to.be.true;
    });

    it('should create a pdf ignoring invalid options', async () => {
        const htmlData = '<html><body><h1>Hello PDF</h1><p>This is a PDF file</p></body></html>';
        const pdfData = await pdfFrom.html(htmlData, {
            displayHeaderFooter: "true",
            format: "invalid",
            landscape: "true",
            printBackground: "true",
            margin: "50px",
            scale: 2.5
        });

        expect(Buffer.isBuffer(pdfData)).to.be.true;
        expect(pdfFrom.displayHeaderFooter).to.be.false;
        expect(pdfFrom.format).to.equal("Letter");
        expect(pdfFrom.landscape).to.be.false;
        expect(pdfFrom.printBackground).to.be.false;
        expect(pdfFrom.margin).to.equal("50px");
        expect(pdfFrom.scale).to.equal(1.0);
    });
});
