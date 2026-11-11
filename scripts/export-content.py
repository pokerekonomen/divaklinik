#!/usr/bin/env python3
"""Hämtar publicerat innehåll från divatandklinik.se och sparar strukturerade block."""

import json
import re
import ssl
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "content" / "documents.json"
CTX = ssl.create_default_context()
UA = {"User-Agent": "Mozilla/5.0 DivaTandklinikRebuild"}

TREATMENTS = {
    "akut-tandvard-goteborg",
    "allmantandvard-goteborg",
    "undersokning",
    "rotfyllning-goteborg",
    "tandimplantat-goteborg",
    "tandreglering-goteborg",
    "visdomstandskirurgi",
    "knackt-tand-i-goteborg",
    "tandblekning-goteborg",
    "estetisk-tandvard",
    "tandvardsradsla",
    "injektionsbehandlingar-goteborg",
}
LEGAL = {"privacy-policy", "cookie-policy", "gdpr-policy"}
SKIP_LINE = re.compile(
    r"^(?:\d{1,2}|läs mer(?:\s*→)?|boka tid(?: online)?|få akut hjälp(?:\s*→)?|ring(?: oss)?(?:\s*\d[\d\s-]*)?)$",
    re.I,
)


def get_json(url: str):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, context=CTX, timeout=40) as res:
        payload = json.loads(res.read().decode("utf-8", "replace"))
        return payload, res.headers


def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()
    text = text.replace("\xa0", " ")
    return text


def blocks_from_html(html: str):
    soup = BeautifulSoup(html or "", "html.parser")
    for tag in soup(["script", "style", "noscript", "form", "iframe", "svg"]):
        tag.decompose()
    blocks = []
    for el in soup.find_all(["h1", "h2", "h3", "h4", "p", "li"]):
        if el.find_parent(["h1", "h2", "h3", "h4"]) and el.name in {"p", "li"}:
            continue
        text = clean(el.get_text(" ", strip=True))
        if len(text) < 2 or SKIP_LINE.match(text):
            continue
        if el.name.startswith("h"):
            blocks.append({"type": "h", "level": int(el.name[1]), "text": text})
        else:
            blocks.append({"type": "p", "text": text})
    # Ta bort dubbletter som sidbyggaren ofta upprepar.
    deduped = []
    for block in blocks:
        if deduped and deduped[-1] == block:
            continue
        deduped.append(block)
    return deduped


def to_document(item: dict, kind: str):
    html = item.get("content", {}).get("rendered", "")
    blocks = blocks_from_html(html)
    title = clean(BeautifulSoup(item.get("title", {}).get("rendered", ""), "html.parser").get_text())
    h1 = next((b["text"] for b in blocks if b["type"] == "h" and b["level"] == 1), title)
    lead = []
    sections = []
    current = None
    started = False
    for block in blocks:
        if block["type"] == "h" and block["level"] == 1:
            started = True
            continue
        if block["type"] == "h" and block["level"] == 2:
            started = True
            current = {"heading": block["text"], "paragraphs": [], "subsections": []}
            sections.append(current)
            continue
        if not started:
            if block["type"] == "p":
                lead.append(block["text"])
            continue
        if current is None:
            if block["type"] == "p":
                lead.append(block["text"])
            continue
        if block["type"] == "h" and block["level"] >= 3:
            current["subsections"].append({"heading": block["text"], "level": block["level"], "paragraphs": []})
            continue
        if block["type"] == "p":
            if current["subsections"]:
                current["subsections"][-1]["paragraphs"].append(block["text"])
            else:
                current["paragraphs"].append(block["text"])
    chars = sum(len(b["text"]) for b in blocks)
    return {
        "id": item.get("id"),
        "slug": item.get("slug"),
        "kind": kind,
        "title": title,
        "link": item.get("link"),
        "date": (item.get("date") or "")[:10],
        "modified": (item.get("modified") or "")[:10],
        "h1": h1,
        "lead": lead[:6],
        "sections": sections,
        "chars": chars,
    }


def fetch_collection(endpoint: str):
    page = 1
    items = []
    while True:
        url = f"https://divatandklinik.se/wp-json/wp/v2/{endpoint}?per_page=50&page={page}"
        try:
            data, headers = get_json(url)
        except Exception as exc:
            print("stop", endpoint, page, exc)
            break
        if not data:
            break
        items.extend(data)
        total = int(headers.get("X-WP-Total") or 0)
        if page * 50 >= total:
            break
        page += 1
    return items


def classify_page(slug: str) -> str:
    if slug in TREATMENTS:
        return "treatment"
    if slug in LEGAL:
        return "legal"
    if slug == "tandlakare-goteborg":
        return "home"
    if slug == "boka-tandlakartid-online":
        return "booking"
    if slug == "tack":
        return "thanks"
    if slug == "blogg":
        return "blog-index"
    if slug == "behandlingar":
        return "treatments-index"
    if slug == "kontakt":
        return "contact"
    if slug == "diva-tandklinik-goteborg":
        return "about"
    if slug == "priser-tandlakare-goteborg":
        return "prices"
    return "page"


def main():
    pages = [to_document(item, classify_page(item["slug"])) for item in fetch_collection("pages")]
    posts = [to_document(item, "post") for item in fetch_collection("posts")]
    docs = pages + posts
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(docs, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"skrev {len(docs)} dokument till {OUT}")
    for doc in docs:
        print(f"{doc['kind']:18} {doc['chars']:6} h2={len(doc['sections']):2} {doc['slug'][:48]:48} {doc['h1'][:70]}")


if __name__ == "__main__":
    main()
