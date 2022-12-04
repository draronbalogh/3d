/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Async / await
 * Fetch json data from url
 * @param url:string
 */
export const fetchData = async (url: string) => {
  try {
    const dataResponse = await fetch(url);

    const data = await dataResponse.json();
    console.log('Fetched data:', data);

    return data;
  } catch (err) {
    console.log('fetchData err:', err);
  }
};
