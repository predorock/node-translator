# Node Translator
A simple node tool to generate translation json file from EXCEL sheet

### Excel sheet format
The idea is to use a standard format for translations excel file for all Horsa projects. The format will look like this :

| keys  | language_a        | language_b        | ... | language_z |
|-------|-------------------|-------------------|-----|------------|
| key_0 | language_a(key_0) | language_b(key_0) | ... | ...        |
| key_1 | language_a(key_1) | language_b(key_1) | ... | ...        |
| key_2 | language_a(key_2) | language_b(key_2) | ... | ...        |

### Other Excel sheet formats
We have seen that the ecxel format can change depending from the customer. We have to decide if we want to support old custom format or not.

### Tests
I have included some Js test libraries (chai, mocha) in order to make a small test suite for this module.

### CI
Handled by gitlab CI system.

### Index Repository
We have to decide if this module will be available all over the world or only inside Horsa company.
