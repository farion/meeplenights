const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type Player = { id: number; name: string };
export type BoardGame = {
  id: number;
  name: string;
  min_players: number;
  max_players: number;
  duration_minutes: number;
  complexity: number;
  categories: string[];
};
export type CatalogueGame = Omit<BoardGame, "id" | "complexity" | "categories"> & { catalogue_id: string };
export type Attendee = Player & { status: "confirmed" | "tentative" | "declined" };
export type NightGame = BoardGame & { manually_selected: boolean };
export type GameNight = {
  id: number;
  title: string;
  scheduled_for: string;
  available_minutes: number;
  attendees: Attendee[];
  games: NightGame[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const detail = (await response.json().catch(() => null))?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg ?? "Invalid input").join(" ")
      : typeof detail === "string" ? detail : "Request failed";
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  listNights: () => request<GameNight[]>("/api/game-nights"),
  getNight: (nightId: number) => request<GameNight>(`/api/game-nights/${nightId}`),
  listPlayers: () => request<Player[]>("/api/players"),
  createPlayer: (name: string) => request<Player>("/api/players", { method: "POST", body: JSON.stringify({ name }) }),
  deletePlayer: (playerId: number) => request<void>(`/api/players/${playerId}`, { method: "DELETE" }),
  listGames: () => request<BoardGame[]>("/api/games"),
  popularGames: () => request<CatalogueGame[]>("/api/catalogue/popular"),
  searchGames: (query: string) => request<CatalogueGame[]>(`/api/catalogue/search?query=${encodeURIComponent(query)}`),
  createNight: (payload: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">) =>
    request<GameNight>("/api/game-nights", { method: "POST", body: JSON.stringify(payload) }),
  updateNight: (nightId: number, payload: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">) =>
    request<GameNight>(`/api/game-nights/${nightId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteNight: (nightId: number) => request<void>(`/api/game-nights/${nightId}`, { method: "DELETE" }),
  addAttendee: (nightId: number, playerId: number) =>
    request<GameNight>(`/api/game-nights/${nightId}/attendees/${playerId}`, { method: "PUT" }),
  removeAttendee: (nightId: number, playerId: number) =>
    request<void>(`/api/game-nights/${nightId}/attendees/${playerId}`, { method: "DELETE" }),
  removeGame: (nightId: number, gameId: number) =>
    request<void>(`/api/game-nights/${nightId}/games/${gameId}`, { method: "DELETE" }),
  addGame: (nightId: number, gameId: number) =>
    request<GameNight>(`/api/game-nights/${nightId}/games/${gameId}`, { method: "PUT" }),
  addCatalogueGame: (nightId: number, catalogueId: string) =>
    request<GameNight>(`/api/game-nights/${nightId}/games/catalogue/${catalogueId}`, { method: "PUT" }),
  setSelected: (nightId: number, gameId: number, selected: boolean) =>
    request<GameNight>(`/api/game-nights/${nightId}/games/${gameId}/selection?selected=${selected}`, { method: "PUT" }),
};
