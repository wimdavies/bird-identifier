// eslint-disable-next-line consistent-return
export default async function getAPI() {
  const response = await fetch('https://api-cdn.rspb.org.uk/species?offset=0&limit=12');
  try {
    if (!response.ok) {
      throw new Error(`HTTP error: status ${response.status}`);
    }
    const data = await response.json();
    const { results } = data.payload;
    return results;
  } catch (error) {
    console.error(error);
  }
}
