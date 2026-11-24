"""Refresh the embedded catalog from iNaturalist's public observation counts."""
import json
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen

API = "https://api.inaturalist.org/v1/observations/species_counts"
LIMIT = 10_000
PAGE_SIZE = 500


def fetch_page(page):
    params = urlencode({
        "place_id": 1,  # United States
        "taxon_id": 211194,  # Tracheophyta
        "quality_grade": "research",
        "captive": "false",
        "per_page": PAGE_SIZE,
        "page": page,
    })
    for attempt in range(4):
        try:
            with urlopen(f"{API}?{params}", timeout=60) as response:
                return json.load(response)["results"]
        except (OSError, ValueError):
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)


def main():
    species = {}
    page = 1
    cutoff = None
    while True:
        results = fetch_page(page)
        if not results:
            break
        for result in results:
            count, taxon = result["count"], result["taxon"]
            if cutoff is not None and count < cutoff:
                break
            if taxon["rank"] == "species" and taxon.get("is_active", True):
                species[taxon["id"]] = [
                    taxon["id"], taxon["name"], taxon.get("preferred_common_name") or "", count
                ]
                if len(species) == LIMIT and cutoff is None:
                    cutoff = count
        if cutoff is not None and results[-1]["count"] < cutoff:
            break
        page += 1
        time.sleep(1)

    records = sorted(species.values(), key=lambda row: (-row[3], row[0]))[:LIMIT]
    if len(records) != LIMIT or len({row[1].casefold() for row in records}) != LIMIT:
        raise SystemExit("Expected 10,000 uniquely named species; catalog was not replaced.")
    target = Path(__file__).resolve().parents[1] / "src/data/usVascularPlants.json"
    target.write_text("[\n" + ",\n".join(json.dumps(row, ensure_ascii=False) for row in records) + "\n]\n",
                      encoding="utf-8")
    print(f"Saved {len(records):,} species through {records[-1][3]} observations.")


if __name__ == "__main__":
    main()
