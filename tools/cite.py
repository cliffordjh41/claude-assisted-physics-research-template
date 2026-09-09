#!/usr/bin/env python3
"""Citation-skeleton generator for the library workflow.

Given an arXiv ID (with or without version) or a DOI, fetches the
bibliographic metadata (arXiv Atom API / Crossref REST API, stdlib only)
and emits a library/<short-name>.md skeleton: the full citation at
publication-reference quality, then empty sections matching the library
file shape (what it is used for, load-bearing passages, date of first
read).

The tool fills in bibliography, nothing else. Reading the source around
the cited result, and the honesty that implies, stays with the reader;
the emitted placeholders say so explicitly.

Usage:
    python3 tools/cite.py 2310.13548
    python3 tools/cite.py 2310.13548v4
    python3 tools/cite.py 10.1103/RevModPhys.93.025010
    python3 tools/cite.py <id> --write            # file it (never overwrites)
    python3 tools/cite.py <id> --slug short-name  # override the file name

Exit codes: 0 on success, 1 on lookup/network failure, 2 on bad usage or
an existing target file.
"""

import argparse
import datetime
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ARXIV_API = "http://export.arxiv.org/api/query?id_list={}"
CROSSREF_API = "https://api.crossref.org/works/{}"
ATOM = "{http://www.w3.org/2005/Atom}"
ARXIV_NS = "{http://arxiv.org/schemas/atom}"

ARXIV_RE = re.compile(r"^(\d{4}\.\d{4,5})(v\d+)?$")
OLD_ARXIV_RE = re.compile(r"^[a-z\-]+(\.[A-Z]{2})?/\d{7}(v\d+)?$")
DOI_RE = re.compile(r"^10\.\d{4,9}/\S+$")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "cite.py (library skeleton tool)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def initials(given):
    """'Mrinank' -> 'M.', 'Jan Hendrik' -> 'J. H.', 'J.-B.' kept as is."""
    parts = re.split(r"[ ]+", given.strip())
    out = []
    for p in parts:
        if not p:
            continue
        if "." in p:  # already initialized (possibly hyphenated)
            out.append(p)
        elif "-" in p:
            out.append("-".join(s[0] + "." for s in p.split("-") if s))
        else:
            out.append(p[0] + ".")
    return " ".join(out)


def arxiv_lookup(arxiv_id):
    """Metadata for an arXiv ID. Returns a dict or raises."""
    xml = fetch(ARXIV_API.format(urllib.parse.quote(arxiv_id)))
    root = ET.fromstring(xml)
    entry = root.find(ATOM + "entry")
    if entry is None:
        raise LookupError("no arXiv entry for %s" % arxiv_id)
    title_el = entry.find(ATOM + "title")
    id_el = entry.find(ATOM + "id")
    if title_el is None or id_el is None or "api/errors" in (id_el.text or ""):
        raise LookupError("arXiv API returned no result for %s" % arxiv_id)
    title = re.sub(r"\s+", " ", title_el.text or "").strip()
    authors = []
    for a in entry.findall(ATOM + "author"):
        name = a.find(ATOM + "name")
        if name is not None and name.text:
            parts = name.text.strip().rsplit(" ", 1)
            if len(parts) == 2:
                authors.append("%s %s" % (initials(parts[0]), parts[1]))
            else:
                authors.append(name.text.strip())
    # Versioned ID from the returned abs URL, e.g. .../abs/2310.13548v4.
    m = re.search(r"/abs/(\S+)$", id_el.text or "")
    versioned = m.group(1) if m else arxiv_id
    published = entry.find(ATOM + "published")
    year = (published.text or "")[:4] if published is not None else ""
    doi_el = entry.find(ARXIV_NS + "doi")
    journal_el = entry.find(ARXIV_NS + "journal_ref")
    return {
        "authors": authors,
        "title": title,
        "year": year,
        "arxiv": versioned,
        "doi": doi_el.text.strip() if doi_el is not None and doi_el.text else None,
        "journal_ref": journal_el.text.strip()
        if journal_el is not None and journal_el.text
        else None,
        "kind": "arxiv",
    }


def crossref_lookup(doi):
    """Metadata for a DOI via Crossref. Returns a dict or raises."""
    data = json.loads(fetch(CROSSREF_API.format(urllib.parse.quote(doi))))
    msg = data["message"]
    authors = []
    for a in msg.get("author", []):
        given = a.get("given", "")
        family = a.get("family", "")
        if family:
            authors.append(("%s %s" % (initials(given), family)).strip())
    title = re.sub(r"\s+", " ", (msg.get("title") or [""])[0]).strip()
    year = ""
    for k in ("published-print", "published-online", "issued"):
        parts = (msg.get(k) or {}).get("date-parts", [[None]])
        if parts and parts[0] and parts[0][0]:
            year = str(parts[0][0])
            break
    pages = msg.get("page") or msg.get("article-number")
    return {
        "authors": authors,
        "title": title,
        "year": year,
        "venue": (msg.get("container-title") or [None])[0],
        "volume": msg.get("volume"),
        "issue": msg.get("issue"),
        "pages": pages,
        "doi": msg.get("DOI", doi),
        "kind": "doi",
    }


def format_citation(meta):
    """One citation string at publication-reference quality."""
    authors = ", ".join(meta["authors"])
    bits = ['%s, "%s,"' % (authors, meta["title"])]
    if meta["kind"] == "doi":
        venue = meta.get("venue")
        if venue:
            v = venue
            if meta.get("volume"):
                v += " " + meta["volume"]
            if meta.get("issue"):
                v += " (%s)" % meta["issue"]
            if meta.get("pages"):
                v += ", " + meta["pages"]
            bits.append(v + ",")
        bits.append("%s." % meta["year"])
        bits.append("DOI %s." % meta["doi"])
    else:
        if meta.get("journal_ref"):
            bits.append(meta["journal_ref"] + ",")
        bits.append("%s." % meta["year"])
        bits.append("arXiv:%s." % meta["arxiv"])
        if meta.get("doi"):
            bits.append("DOI %s." % meta["doi"])
    return " ".join(bits)


def default_slug(meta):
    """<first-author-family>-<year>, lowercased."""
    family = "source"
    if meta["authors"]:
        family = meta["authors"][0].split()[-1]
    slug = "%s-%s" % (family.lower(), meta["year"] or "n.d.")
    return re.sub(r"[^a-z0-9\-]", "", slug)


def render(meta, today):
    cite = format_citation(meta)
    ident = "arXiv:%s" % meta["arxiv"] if meta["kind"] == "arxiv" else "DOI %s" % meta["doi"]
    return """# {title}

## Citation

{cite}

## Used for

(one line on what this source is used for here -- fill in when first cited)

## Load-bearing passages

(verbatim quotes of the equations or passages this project leans on, each
with its location in the source -- fill in while reading; do not cite a
result whose surrounding context has not been read)

## First read

(date of first read -- the skeleton was generated {today} from {ident};
generation is not reading)
""".format(title=meta["title"], cite=cite, today=today, ident=ident)


def main():
    ap = argparse.ArgumentParser(description="library citation-skeleton generator")
    ap.add_argument("identifier", help="arXiv ID (e.g. 2310.13548[v4]) or DOI (10.xxxx/...)")
    ap.add_argument("--write", action="store_true", help="write library/<slug>.md instead of stdout")
    ap.add_argument("--slug", help="override the file short-name")
    args = ap.parse_args()

    ident = args.identifier.strip()
    ident = re.sub(r"^(arxiv:|doi:)", "", ident, flags=re.IGNORECASE)
    try:
        if ARXIV_RE.match(ident) or OLD_ARXIV_RE.match(ident):
            meta = arxiv_lookup(ident)
        elif DOI_RE.match(ident):
            meta = crossref_lookup(ident)
        else:
            print("unrecognized identifier: %s (expected arXiv ID or DOI)" % ident, file=sys.stderr)
            return 2
    except Exception as e:
        print("lookup failed for %s: %s" % (ident, e), file=sys.stderr)
        return 1

    if not meta["authors"] or not meta["title"] or not meta["year"]:
        print(
            "metadata incomplete (authors/title/year) for %s; refusing to emit a partial citation"
            % ident,
            file=sys.stderr,
        )
        return 1

    text = render(meta, datetime.date.today().isoformat())
    if args.write:
        root = Path(__file__).resolve().parent.parent
        path = root / "library" / ((args.slug or default_slug(meta)) + ".md")
        if path.exists():
            print("refusing to overwrite %s" % path, file=sys.stderr)
            return 2
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        print(str(path))
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
