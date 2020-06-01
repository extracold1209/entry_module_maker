import Archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';

export interface IArchiverCompression {
    type: string;
    filePath: string;
}

export default new class {
    public clearDirectory(directoryPath: string) {
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

    public isEmptyDir(dirPath: string) {
        try {
            const stat = fs.statSync(dirPath);
            return stat.size === 0;
        } catch (e) {
            return true;
        }
    }

    /**
     * 해당 파일이 존재하는지 확인한다.
     * @param filePath
     * @return Promise<boolean>
     */
    public isExist(filePath: string) {
        return new Promise((resolve) => {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public async copyFile(src: string, dest: string) {
        fs.ensureDirSync(path.dirname(dest));
        await fs.copyFile(src, dest);
    }

    public writeJSONFile(src: string, content: any) {
        return new Promise((resolve, reject) => {
            try {
                const stringJSON = JSON.stringify(content, null, 4);
                fs.writeFile(src, stringJSON, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public readJSONFile<T>(src: string): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!src.toString()
                .match(/\.json$/)) {
                reject(`${src} file not json`);
                return;
            }

            fs.readFile(src, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data.toString()) as T);
                }
            });
        });
    }

    public compress(files: IArchiverCompression[], destFilePath: string) {
        return new Promise((resolve, reject) => {
            const fsWriteStream = fs.createWriteStream(destFilePath);
            const archiver = Archiver('tar');

            fsWriteStream.on('error', reject);
            archiver.on('error', reject);
            fsWriteStream.on('finish', resolve);

            archiver.pipe(fsWriteStream);
            files.forEach((file) => {
                const { type, filePath } = file;
                switch (type) {
                    case 'file':
                        archiver.file(filePath, { name: path.basename(filePath) });
                        break;
                    case 'root':
                        archiver.directory(filePath, false);
                        break;
                    case 'directory':
                        console.log(path.basename(filePath));
                        archiver.directory(filePath, path.basename(filePath));
                        break;
                }
            });
            archiver.finalize();
        });
    }
}();
