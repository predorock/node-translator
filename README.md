# Node Translator
A tool to convert your translations from Excel file into separate language Json files

### Excel sheet format
The idea is to use a standard format for translations excel file. The format will look like this :

| keys  | language_a        | language_b        | ... | language_z |
|-------|-------------------|-------------------|-----|------------|
| key_0 | language_a(key_0) | language_b(key_0) | ... | ...        |
| key_1 | language_a(key_1) | language_b(key_1) | ... | ...        |
| key_2 | language_a(key_2) | language_b(key_2) | ... | ...        |

### Tests
I have included some Js test libraries (chai, mocha) in order to make a small test suite for this module.

### CI ![alt text][status]

[status]: https://travis-ci.org/predorock/node-translator.svg?branch=master

