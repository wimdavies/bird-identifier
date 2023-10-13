export default async function getAPI(offset) {
  const response = await fetch(`https://api-cdn.rspb.org.uk/species?limit=1&offset=${offset}`);
  try {
    if (!response.ok) {
      throw new Error(`HTTP error: status ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== 200) {
      return [`Result for offset ${offset} is null`];
    }
    return data.payload.results;
  } catch (error) {
    console.error(error);
  }
}
