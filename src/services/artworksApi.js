const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Llama al endpoint de artworks y devuelve:
 * { artworks, pagination, iiifUrl }
 */
export async function fetchArtworks(page = 1, limit = 20) {
  const url = new URL(BASE_URL);

  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());
  url.searchParams.set(
    "fields",
    [
      "id",
      "title",
      "artist_title",
      "date_display",
      "date_start",      
      "image_id",
      "gallery_title",
    ].join(",")
  );

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Error al cargar obras");
  }

  const json = await response.json();

  return {
    artworks: json.data || [],
    pagination: json.pagination || {},
    iiifUrl: json.config?.iiif_url || "https://www.artic.edu/iiif/2",
  };
}
