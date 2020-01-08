import Archiver from 'archiver';
import fs, { PathLike } from 'fs';
import path from 'path';
import rimraf from 'rimraf';

interface IArchiverCompression {
    type: string;
    filePath: string;
}

export default class {
    public static clearBuildDirectory(directoryPath: string) {
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

    /**
     * 해당 파일이 존재하는지 확인한다.
     * @param filePath
     * @return Promise<boolean>
     */
    public static isExist(filePath: PathLike) {
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

    public static copyFile(src: PathLike, dest: PathLike) {
        return new Promise((resolve, reject) => {
            fs.copyFile(src, dest, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static writeJSONFile(src: PathLike, content: any) {
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

    public static readJSONFile<T>(src: PathLike): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!src.toString().match(/\.json$/)) {
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

    public static compress(files: IArchiverCompression[], destFilePath: PathLike) {
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
                    case 'directory':
                        archiver.directory(filePath, false);
                        break;
                }
            });
            archiver.finalize();
        });
    }
}
