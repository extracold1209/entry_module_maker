import rimraf from 'rimraf';

export default class {
    static clearBuildDirectory(directoryPath: string) {
        return new Promise((resolve, reject) => {
            rimraf(directoryPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
