const _    = require('lodash');
const xlxs = require('xlsx');

const inputTypes = [
    "base64",
    "binary",
    "string",
    "buffer",
    "array",
    "file"
]

class WrongConfigException {

    constructor (message) {
        this.name = 'WrongConfigException';
        this.message = message
    }

}

let checkConfig = (config) => {
    if (_.isNil(config.source) || config.source == "") 
        throw new WrongConfigException('Source must be defined');
    if (_.isNil(config.type) || config.type == "") 
        throw new WrongConfigException('Type must be defined');
    if (inputTypes.indexOf(config.type) === -1) 
        throw new WrongConfigException('Type must be one of: [' + inputTypes.join(', ') + ']');
}


let translations = (config) => {

    checkConfig(config);

    const workbook = xlxs.read(config.source, {
        type: config.type
    });

    var translations = {};
    _.forEach(workbook.SheetNames, function (sheetName) {
        var sheet = workbook.Sheets[sheetName];
        var raw_translations = xlxs.utils.sheet_to_row_object_array(sheet);
        var languages = null;
        _.forEach(raw_translations, function (entry) {
            //normalization
            let row = _.chain(entry)
                .mapKeys((v,k)=> _.trim(k))
                .mapValues(_.trim)
                .value();

            let key = row['key'];
            let languages = _.chain(row)
                .keysIn(row)
                .filter((k) => k != 'key')
                .value();
            // let keys = Object.keys(entry);
            // _.remove(languages, function (k) {
            //     return k == 'key';
            // });

            // languages = _.keysIn(entry);
            // _.remove(languages, function (k) {
            //     return k == 'key';
            // });
            // var key = entry['key'];
            _.forEach(languages, function (lang) {
                if (translations[lang] == undefined) {
                    translations[lang] = {};
                }
                translations[lang][key] = row[lang];
            });
        });
    });

    return translations;

    // _.forEach(translations, function (localeDict, locale) {
    //     var fileName = locale + ".json";
    //     fs.writeFileSync('app/main/assets/translations/' + fileName, JSON.stringify(localeDict));
    //     console.log("Translating " + locale + " language done");
    // });

}

module.exports = {
    sourceTypes: inputTypes,
    translations: translations
}