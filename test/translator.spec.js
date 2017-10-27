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
    const out = translator.translations({source: input, type: 'string'});
    expect(out).should.be.jsonSchema(expected)
}

let testTranslatorConfigException = (config, expectedMessage) => {
    expect(function () {
            translator.translations(config)
    }).to.throw(expectedMessage);
}


describe('translations', () => {

    describe('checking wrong configuration', function () {
        it('should thrown an exception with message: \'Source must be defined\'', function () {

            const msg = 'Source must be defined';

            testTranslatorConfigException({}, msg);
            testTranslatorConfigException({source:null}, msg);
            testTranslatorConfigException({source:undefined}, msg);
            testTranslatorConfigException({source:""}, msg);
        });

        it('should thrown an exception with message: \'Type must be defined\'', function () {
            
            const msg = 'Type must be defined';
            let validSourceConfig = {source: "key,it,en,fr"}
            
            validSourceConfig.type = null;
            testTranslatorConfigException(validSourceConfig, msg);
            validSourceConfig.type = undefined;
            testTranslatorConfigException(validSourceConfig, msg);
            validSourceConfig.type = ""
            testTranslatorConfigException(validSourceConfig, msg);
        });

        it('should thrown an exception with message: \'Type must be one of ' + translator.sourceTypes.join(', ') +'\'', function () {
            
            const msg = 'Type must be one of: [' + translator.sourceTypes.join(', ') + ']';
            let validSourceConfig = {source: "key,it,en,fr"}
            validSourceConfig.type = "pippo";
            testTranslatorConfigException(validSourceConfig, msg)
            validSourceConfig.type = 22;
            testTranslatorConfigException(validSourceConfig, msg)
            validSourceConfig.type = {type:"string"};
            testTranslatorConfigException(validSourceConfig, msg)
        });
    });

    describe('checking translator output', function () {
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
    });
    
});