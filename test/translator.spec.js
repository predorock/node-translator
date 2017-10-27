let chai   = require('chai'),
    expect = require('chai').expect,
    assert = require('chai').assert,
    path   = require('path'),
    translator = require('../src/translator');
    
// Tell chai that we'll be using the "should" style assertions.
chai.should();

let testTextJsonTranslation = (input, expected) => {
    const out = translator.translations({source: input, type: 'string'});
    expect(out).to.deep.equal(expected);
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
        
        it('should return a empty json', function () {
            const textSheet = "key, it, en, de, fr\ngreet";
            const expected = {};
            testTextJsonTranslation(textSheet, expected);
        });
        
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

        it('should return only defined translations', function () {
            const textSheet = "key, it, en, de, fr\ngreet, ciao, , hallo";
            const expected = {
                it: {
                    greet: 'ciao'
                },
                en: {
                    greet: ''
                },
                de: {
                    greet: 'hallo'
                }
            };
            testTextJsonTranslation(textSheet, expected);
        });


        it('should return multiple key translations', function () {
            const textSheet = 
                    "key, it, en, de\n" +
                    "greet, ciao, hello, hallo\n" +
                    "thanks, grazie, thanks, danke";
            const expected = {
                it: {
                    greet: 'ciao',
                    thanks: 'grazie'
                },
                en: {
                    greet: 'hello',
                    thanks: 'thanks'
                },
                de: {
                    greet: 'hallo',
                    thanks: 'danke'
                }
            };
            testTextJsonTranslation(textSheet, expected);
        });
        

        
    });
    
});