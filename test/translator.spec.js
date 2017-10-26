let chai   = require('chai'),
    expect = require('chai').expect;
    assert = require('chai').assert; 
    jsonSchema = require('chai-json-schema')
    path   = require('path')
    translator = require('../src/translator')

chai.use(jsonSchema);
// Tell chai that we'll be using the "should" style assertions.
chai.should();

let testTextJsonTranslation = (input, expected) => {
    const out = translator.translations({source: input, type: "string"});
    expect(out).should.be.jsonSchema(expected)
}


describe('translations', () => {
    it('should return a json with it and en translations of \'ciao\' in key of greet', function () {
        const textSheet = "key, it, en\ngreet, ciao, hello";
        const expected = {
            it: {
                greet:'ciao'
            },
            en: {
                greet:'hello'
            }
        };
        testTextJsonTranslation(textSheet, expected);
    });

    it('should thrown an exception with message: \'Source must be defined\'', function () {
        expect(function () {
            translator.translations({})
        }).to.throw('Source must be defined')
    });
});