import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

/**
 * Create necessary directories
 * @param filePath string
 * @returns
 */
export const createNecessaryDirectoriesSync = (filePath: string) => {
  const directoryname = path.join(filePath); // can be path.dirname()
  if (fs.existsSync(directoryname)) {
    return;
  }
  fs.mkdirSync(directoryname, { recursive: true });
};

/**
 * Write text in file
 * @param filePath string
 * @param string string
 * @returns
 */
export const writeTextInFile = async (filePath: string, string: string) => {
  createNecessaryDirectoriesSync(filePath);
  return await fsPromises.writeFile(filePath, string);
};

/**
 * Read text from file
 * @param files string[]
 * @param destination string
 * @param separator string
 */
export const concatenateFiles = async (files: [], destination: string, separator = '') => {
  return await Promise.all(
    files.map(async (filePath: string) => {
      return await fsPromises.readFile(filePath, 'utf-8');
    })
  ).then(async (contents) => {
    return await writeTextInFile(destination, contents.join(separator));
  });
};

/**
 * Copy file
 * @param filePath string
 * @param filePathDestination string
 * @returns
 */
const copyFile = async (filePath: string, filePathDestination: string) => {
  return await new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`${filePath} does not exist`));
      return;
    }
    createNecessaryDirectoriesSync(filePathDestination);
    return fsPromises.copyFile(filePath, filePathDestination).then(resolve).catch(reject);
  });
};

/**
 * Copy directory
 * @param directoryPath string
 * @param directoryPathDestination string
 */
export const copyDirectory = async (directoryPath: string, directoryPathDestination: string) => {
  return await new Promise((resolve, reject) => {
    if (!fs.existsSync(directoryPath)) {
      reject(new Error(`${directoryPath} does not exist`));
      return;
    }
    createNecessaryDirectoriesSync(directoryPathDestination);
    fs.readdir(directoryPath, { withFileTypes: true }, (error, dirents) => {
      if (error) {
        reject(error);
        return;
      }
      Promise.all(
        dirents.map((dirent) => {
          const joinedSource = path.join(directoryPath, dirent.name);
          const joinedDestination = path.join(directoryPathDestination, dirent.name);
          if (dirent.isDirectory()) {
            if (!fs.existsSync(joinedDestination)) {
              fs.mkdirSync(joinedDestination, { recursive: true });
            }
            return copyDirectory(joinedSource, joinedDestination);
          }
          if (dirent.isFile()) {
            return copyFile(joinedSource, joinedDestination);
          }
          return true;
        })
      )
        .then((res) => {
          resolve(res);
        })
        .catch(reject);
    });
  });
};

/**
 * Delete options
 */
export const deleteOptions = {
  force: true,
  recursive: true,
  maxRetries: 1
};

/**
 * Delete File
 * @param sourcePath string
 * @returns
 */
export const deleteFile = async (sourcePath: string) => {
  return await fsPromises.rm(sourcePath, deleteOptions);
};

/**
 * Get file names in a directory
 * @param directoryPath string
 */
export const namesInDirectory = async (directoryPath: string) => {
  return await new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (error, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(files);
    });
  });
};
