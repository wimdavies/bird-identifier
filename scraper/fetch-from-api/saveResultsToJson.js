import * as fs from 'fs';

export default async function saveResultsToJson() {
  const response = await fetch('https://api-cdn.rspb.org.uk/species?offset=0&limit=12');
  try {
    if (!response.ok) {
      throw new Error(`HTTP error: status ${response.status}`);
    }
    const data = await response.json();
    const { results } = data.payload;
    fs.writeFile(
      './file-output/saveResultsToJsonResults.json',
      JSON.stringify(results, null, 2),
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Saved results to JSON');
        }
      },
    );
    // return results;
  } catch (error) {
    console.error(error);
  }
}

saveResultsToJson();
