import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

export const createNecessaryDirectoriesSync = (filePath: string) => {
  const directoryname = path.join(filePath); // can be path.dirname()
  if (fs.existsSync(directoryname)) {
    return;
  }
  fs.mkdirSync(directoryname, { recursive: true });
};

export const writeTextInFile = async (filePath: string, string: string) => {
  createNecessaryDirectoriesSync(filePath);
  return await fsPromises.writeFile(filePath, string);
};

export const concatenateFiles = async (files: [], destination: string, separator = '') => {
  return await Promise.all(
    files.map(async (filePath: string) => {
      return await fsPromises.readFile(filePath, 'utf-8');
    })
  ).then(async (contents) => {
    return await writeTextInFile(destination, contents.join(separator));
  });
};
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

export const deleteOptions = {
  force: true,
  recursive: true,
  maxRetries: 1
};

export const deleteFile = async (sourcePath: string) => {
  return await fsPromises.rm(sourcePath, deleteOptions);
};

// todo deprecate in favor of await fsPromises.readdir
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

/**
 * returns all the filenames, files in subfolders will have their subfolders in the name
 * @param {string} directoryPath
 * @returns {Promise [<string>]}

const namesInDirectoryRecursive = async (directoryPath: string) => {
  const dirents = await fsPromises.readdir(directoryPath, { withFileTypes: true });
  return (
    await Promise.all(
      dirents.map(async (dirent) => {
        if (dirent.isFile()) {
          return dirent.name;
        }
        if (dirent.isDirectory()) {
          return (await namesInDirectoryRecursive(path.join(directoryPath, dirent.name))).map((temp: string) => {
            return `${dirent.name}/${temp}`;
          });
        }
      })
    )
  )
    .filter(Boolean)
    .flat(Infinity);
};
export const emptyDirectory = async (directoryPath: string) => {
  return await namesInDirectory(directoryPath).then(async (files: any) => {
    return await Promise.all(
      files
        .map((name: string) => {
          return path.join(directoryPath, name);
        })
        .map(deleteFile)
    );
  });
}; */
