const RAWG_BASE_URL = "https://api.rawg.io/api";

export async function rawgFetch<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const searchParams = new URLSearchParams({
    key: process.env.RAWG_API_KEY!,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  const res = await fetch(
    `${RAWG_BASE_URL}${endpoint}?${searchParams.toString()}`,
    {
      next: { revalidate: 60 }, // cache for 1 min (optional)
    }
  );

  if (!res.ok) {
    throw new Error("RAWG API request failed");
  }

  return res.json();
}
