const chai = require("chai");
const expect = chai.expect;

const pdfFrom = require('../index');

describe('exports', () => {
    it('should expose pdfFrom.html', () => {
        expect(pdfFrom.html).to.be.an.instanceof(Function);
    });
});
