"""Token-free TableArchive client used by the live game catalogue."""

from dataclasses import dataclass
import json
from time import monotonic
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

TABLE_ARCHIVE_URL = "https://tablearchive.dev/v1/items"
CACHE_SECONDS = 300


class TableArchiveUnavailableError(Exception):
    """TableArchive did not provide a usable response."""


@dataclass(frozen=True)
class CatalogueGame:
    catalogue_id: str
    name: str
    min_players: int
    max_players: int
    duration_minutes: int


class TableArchiveClient:
    def __init__(self) -> None:
        self._cache: dict[str, tuple[float, list[CatalogueGame]]] = {}

    def popular(self, limit: int) -> list[CatalogueGame]:
        return self._list_games("popular", {"kind": "board_game", "sort": "popular", "limit": str(limit)})

    def search(self, query: str, limit: int) -> list[CatalogueGame]:
        return self._list_games(
            f"search:{query.casefold()}",
            {"kind": "board_game", "q": query, "limit": str(limit)},
        )

    def game(self, catalogue_id: str) -> CatalogueGame:
        cached = self._get_cached(f"game:{catalogue_id}")
        if cached:
            return cached[0]
        payload = self._get_json(f"{TABLE_ARCHIVE_URL}/{catalogue_id}")
        game = self._parse_game(payload)
        self._cache[f"game:{catalogue_id}"] = (monotonic(), [game])
        return game

    def _list_games(self, cache_key: str, parameters: dict[str, str]) -> list[CatalogueGame]:
        cached = self._get_cached(cache_key)
        if cached is not None:
            return cached
        payload = self._get_json(f"{TABLE_ARCHIVE_URL}?{urlencode(parameters)}")
        games = [self._parse_game(item) for item in payload.get("items", [])]
        self._cache[cache_key] = (monotonic(), games)
        for game in games:
            self._cache[f"game:{game.catalogue_id}"] = (monotonic(), [game])
        return games

    def _get_cached(self, key: str) -> list[CatalogueGame] | None:
        cached = self._cache.get(key)
        if cached and monotonic() - cached[0] < CACHE_SECONDS:
            return cached[1]
        return None

    @staticmethod
    def _parse_game(item: dict) -> CatalogueGame:
        data = item.get("data", {})
        return CatalogueGame(
            catalogue_id=item["id"],
            name=item.get("name", "Unknown game"),
            min_players=data.get("min_players") or 1,
            max_players=data.get("max_players") or 1,
            duration_minutes=data.get("max_playtime") or data.get("min_playtime") or 0,
        )

    @staticmethod
    def _get_json(url: str) -> dict:
        request = Request(url, headers={"User-Agent": "MeepleNightWorkshop/0.1 (local demo)"})
        try:
            with urlopen(request, timeout=10) as response:
                return json.loads(response.read())
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
            raise TableArchiveUnavailableError("The game catalogue is currently unavailable") from error


table_archive_client = TableArchiveClient()
