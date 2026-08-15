from __future__ import annotations

import re
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import (
    HTTPRedirectHandler,
    Request,
    build_opener,
)

_COORDINATE_PATTERNS = (
    re.compile(
        r"/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)"
    ),
    re.compile(
        r"!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)"
    ),
)

_ALLOWED_HOSTS = {
    "google.com",
    "www.google.com",
    "maps.google.com",
    "maps.app.goo.gl",
    "goo.gl",
}

_MAX_REDIRECTS = 5
_TIMEOUT_SECONDS = 8


class MapsResolutionError(ValueError):
    """Google Maps URL tidak dapat di-resolve menjadi koordinat."""


class _NoRedirectHandler(HTTPRedirectHandler):
    def redirect_request(
        self,
        req,
        fp,
        code,
        msg,
        headers,
        newurl,
    ):
        return None


def _normalize_host(hostname: str | None) -> str:
    return (hostname or "").lower().rstrip(".")


def _is_allowed_host(hostname: str | None) -> bool:
    host = _normalize_host(hostname)

    if host in _ALLOWED_HOSTS:
        return True

    return host.endswith(".google.com")


def _validate_google_url(url: str) -> None:
    parsed = urlparse(url)

    if parsed.scheme not in {"http", "https"}:
        raise MapsResolutionError(
            "Link Google Maps harus menggunakan HTTP atau HTTPS."
        )

    if not _is_allowed_host(parsed.hostname):
        raise MapsResolutionError(
            "URL harus berasal dari Google Maps."
        )


def _extract_coordinates(
    url: str,
) -> tuple[float, float] | None:
    parsed = urlparse(url)

    # -----------------------------------------------------
    # /@latitude,longitude
    # -----------------------------------------------------

    match = _COORDINATE_PATTERNS[0].search(
        parsed.path
    )

    if match:
        return (
            float(match.group(1)),
            float(match.group(2)),
        )

    # -----------------------------------------------------
    # !3dLAT!4dLNG
    # -----------------------------------------------------

    match = _COORDINATE_PATTERNS[1].search(url)

    if match:
        return (
            float(match.group(1)),
            float(match.group(2)),
        )

    # -----------------------------------------------------
    # ?q=LAT,LNG
    # ?query=LAT,LNG
    # ?ll=LAT,LNG
    # -----------------------------------------------------

    for parameter in (
        "q",
        "query",
        "ll",
    ):
        value = parsed.query

        if not value:
            continue

        from urllib.parse import parse_qs

        values = parse_qs(value).get(parameter)

        if not values:
            continue

        candidate = values[0].strip()

        coordinate_match = re.fullmatch(
            r"\s*(-?\d+(?:\.\d+)?)\s*,\s*"
            r"(-?\d+(?:\.\d+)?)\s*",
            candidate,
        )

        if coordinate_match:
            return (
                float(coordinate_match.group(1)),
                float(coordinate_match.group(2)),
            )

    return None


def _validate_coordinate_range(
    latitude: float,
    longitude: float,
) -> None:
    if not -90 <= latitude <= 90:
        raise MapsResolutionError(
            "Latitude dari Google Maps tidak valid."
        )

    if not -180 <= longitude <= 180:
        raise MapsResolutionError(
            "Longitude dari Google Maps tidak valid."
        )


def _resolve_redirects(
    url: str,
) -> str:
    current_url = url

    opener = build_opener(
        _NoRedirectHandler()
    )

    for _ in range(_MAX_REDIRECTS + 1):
        _validate_google_url(current_url)

        request = Request(
            current_url,
            headers={
                "User-Agent": (
                    "KosOmahSubardiman/1.0 "
                    "(Google Maps URL resolver)"
                )
            },
            method="GET",
        )

        try:
            response = opener.open(
                request,
                timeout=_TIMEOUT_SECONDS,
            )

            final_url = response.geturl()

            _validate_google_url(final_url)

            return final_url

        except HTTPError as exc:
            if exc.code not in {
                301,
                302,
                303,
                307,
                308,
            }:
                raise MapsResolutionError(
                    "Google Maps tidak dapat diakses."
                ) from exc

            location = exc.headers.get(
                "Location"
            )

            if not location:
                raise MapsResolutionError(
                    "Redirect Google Maps tidak memiliki "
                    "tujuan yang valid."
                )

            from urllib.parse import urljoin

            next_url = urljoin(
                current_url,
                location,
            )

            _validate_google_url(next_url)

            current_url = next_url

        except URLError as exc:
            raise MapsResolutionError(
                "Gagal menghubungi Google Maps."
            ) from exc

        except TimeoutError as exc:
            raise MapsResolutionError(
                "Google Maps terlalu lama merespons."
            ) from exc

    raise MapsResolutionError(
        "Terlalu banyak redirect pada URL Google Maps."
    )


def resolve_google_maps_coordinates(
    value: str | None,
) -> tuple[float, float] | None:
    """
    Resolve Google Maps URL menjadi:

        (latitude, longitude)

    Mengembalikan None jika URL dikosongkan.

    Melempar MapsResolutionError jika URL tidak valid
    atau tidak dapat menghasilkan koordinat.
    """

    if value is None:
        return None

    url = value.strip()

    if not url:
        return None

    _validate_google_url(url)

    # Coba langsung terlebih dahulu.
    coordinates = _extract_coordinates(url)

    if coordinates:
        _validate_coordinate_range(
            coordinates[0],
            coordinates[1],
        )

        return coordinates

    # Untuk maps.app.goo.gl, resolve redirect.
    resolved_url = _resolve_redirects(url)

    coordinates = _extract_coordinates(
        resolved_url
    )

    if coordinates is None:
        raise MapsResolutionError(
            "Lokasi Google Maps tidak dapat "
            "ditemukan dari link tersebut."
        )

    _validate_coordinate_range(
        coordinates[0],
        coordinates[1],
    )

    return coordinates