/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/**
 * huDate()
 * @returns date in hungarian format
 */
export const huDate = () => {
  return new Date().toLocaleTimeString('hu-HU');
};

/**
 * Prevent right click on app
 */
export const disableRightClick = () => {
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  window.addEventListener('contextmenu', (e) => e.preventDefault());
};

/**
 * is valid type
 * @returns
 */
export const validNumbers = (a: number, b: number) => typeof a === 'number' && typeof b === 'number';

/**
 * Async / await
 * Fetch json data from url
 * @param {*} url
 */
export const removeHunChars = (e: string) => {
  try {
    // regex replace multiple spaces with one
    let a: string = removeAccents(
      e
        .toLocaleLowerCase()
        .replace(/[^a-zA-Z0-9 áéíóöőúüű_]/g, '')
        .replace(/-+/g, '-')
        .replace(/\s+/g, ' ')
    );
    a = a.replace(/[_ \s]/g, '-').replace(/--/g, '-');
    return a;
  } catch (err) {
    console.log('fetchData err:', err);
  }
};

export const getCurrentTimeAndDate = () => {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const h = String(today.getHours());
    const m = String(today.getMinutes());
    const s = String(today.getSeconds());
    const yyyy = today.getFullYear();
    return `${yyyy}.${dd}.${mm} ${h}:${m}:${s}`;
  } catch (err) {
    console.log('fetchData err:', err);
  }
};

export const removeAccents = (str: any) => {
  try {
    const convMap: Record<string, string> = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ö: 'o',
      ő: 'o',
      ú: 'u',
      ü: 'u',
      ű: 'u'
    };
    for (const i in convMap) {
      str = str.replace(new RegExp(i, 'g'), convMap[i]);
    }
    return str;
  } catch (err) {
    console.log('fetchData err:', err);
  }
};

export const getAbcKeys = (c1: string, c2: string) => {
  try {
    const a = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return a.slice(a.indexOf(c1), a.indexOf(c2) + 1);
  } catch (err) {
    console.log('fetchData err:', err);
  }
};
