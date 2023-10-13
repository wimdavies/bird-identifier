import * as fs from 'fs';
import getAPI from './getAPI.js';

export default async function getAllBirdResults() {
  const allBirdResults = [];
  const offsets = Array.from({ length: 266 }, (_, index) => index);

  for (const offset of offsets) {
    console.log(`Current offset: ${offset}`);
    const offsetResults = await getAPI(offset);
    console.log(offsetResults);
    allBirdResults.push(...offsetResults);
  }

  fs.writeFile(
    './file-output/allBirdResults.json',
    JSON.stringify(allBirdResults, null, 2),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Saved results to JSON');
      }
    },
  );
}

getAllBirdResults();
