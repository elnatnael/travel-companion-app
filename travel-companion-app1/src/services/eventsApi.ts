export async function fetchEvents(city: string) {
  const url = `https://kudago.com/public-api/v1.4/events/?location=${city}&page_size=10&actual_since=${Math.floor(
    Date.now() / 1000
  )}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.results;
}
