import inquirer from 'inquirer';
import semver from 'semver';
import fs from 'fs';
import path from 'path';
import entryModuleCompress from '../main/entryModuleCompress';


(async() => {
    const result = await inquirer.prompt([
        {
            type: 'input',
            name: 'moduleName',
            message: 'input module\'s distinguished name (it used filename)',
            validate: (name) => !!name,
        },
        {
            type: 'input',
            name: 'version',
            message: 'input module\'s version (must be semantic version style)',
            validate: (name) => (semver.valid(name) ? true : 'version is invalid'),
        },
        {
            type: 'input',
            name: 'blockFilePath',
            message: 'input entry-js block file path',
            validate: (filePath: string) => (filePath.endsWith('.js') ? true : 'please select js file'),
        },
        {
            type: 'input',
            name: 'hardwareModulePath',
            message: 'input entry-hw module path',
        },

    ]);
    console.log(result);

    // await entryModuleCompress(/*{
    //     moduleName,
    //     version,
    //     hardwareModulePath,
    //     blockFilePath,
    // }*/);
    // .then(() => {
    //     alert('Module Compressed Successfully.');
    // })
    // .catch((e) => {
    //     alert('Module Compression Failed. Detail error wrote on devtool console.');
    //     console.error(e);
    // })
})();
