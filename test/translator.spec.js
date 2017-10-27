let chai   = require('chai'),
    expect = require('chai').expect;
    assert = require('chai').assert; 
    jsonSchema = require('chai-json-schema')
    path   = require('path')
    translator = require('../src/translator');

chai.use(jsonSchema);
// Tell chai that we'll be using the "should" style assertions.
chai.should();

let testTextJsonTranslation = (input, expected) => {
    const out = translator.translations({source: input, type: 'string'});
    expect(out).should.be.jsonSchema(expected)
}

let testException = (fn, params, expectedMessage) => {
    const msg = [params, ' should thrown an exception with message: \'', expectedMessage, '\''].join('');
    it(msg, function () {
        expect(fn).to.throw(expectedMessage);
    });
}

let testTranslatorConfigException = (config, expectedMessage) => {
    testException(() => translator.translations(config), JSON.stringify(config), expectedMessage);
}

let testNullValuesException = (config, key, message) => {
    let _config = config;
    _config[key] = undefined;
    testTranslatorConfigException(config, message);
    _config[key] = null;
    testTranslatorConfigException(config, message);
    _config[key] = "";
    testTranslatorConfigException(config, message);
} 

const sourceExceptionMessage = 'Source must be defined';
const typeExceptionMessage   = 'Type must be defined';
const wrongTypeExceptionMessage = 'Type must be one of: [' + translator.sourceTypes.join(', ') +']';

describe('translations', () => {

    describe('checking wrong configuration', function () {

        testNullValuesException({}, 'source', sourceExceptionMessage);

        testNullValuesException({source:'key, it, fr, en'}, 'type', typeExceptionMessage);

        let validSourceConfig = {source: "key,it,en,fr"}
        validSourceConfig.type = "pippo";
        testTranslatorConfigException(validSourceConfig, wrongTypeExceptionMessage);
        validSourceConfig.type = 22;
        testTranslatorConfigException(validSourceConfig, wrongTypeExceptionMessage);
        validSourceConfig.type = {type: "string"};
        testTranslatorConfigException(validSourceConfig, wrongTypeExceptionMessage);
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