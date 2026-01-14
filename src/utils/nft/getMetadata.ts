import { formatIpfsUri } from "../formatters";

export interface LevelMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

/**
 * Fetch metadata from a given URI
 * @param uri - The URI to fetch metadata from
 * @returns The metadata or null if there was an error
 */
export const getMetadata = async (uri: string): Promise<LevelMetadata | null> => {
  const formattedUri = formatIpfsUri(uri);

  // Check cache first
  try {
    const cachedData = localStorage.getItem(formattedUri);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Error reading metadata from localStorage:", error);
  }

  try {
    const response = await fetch(formattedUri);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch metadata from ${formattedUri}: ${response.status} ${response.statusText}`
      );
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Invalid content type for ${formattedUri}: ${contentType}`);
    }
    const data = await response.json();

    // Cache the data
    try {
      localStorage.setItem(formattedUri, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }

    return data;
  } catch (error) {
    console.error("Error fetching metadata from", formattedUri, ":", error);
    return null;
  }
};
