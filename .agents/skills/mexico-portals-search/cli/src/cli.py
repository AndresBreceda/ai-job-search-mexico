#!/usr/bin/env python3
"""
CLI tool for searching Mexican job portals (OCCMundial & Computrabajo México)
Zero external dependencies. Works across Windows, Linux and macOS with Python 3.
"""

import sys
import re
import json
import argparse
import urllib.request
import urllib.parse
from html import unescape

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
}

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = unescape(text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def search_occ(query: str, location: str = "", limit: int = 15):
    slug_q = urllib.parse.quote(re.sub(r"[^\w\s-]", "", query).strip().replace(" ", "-").lower())
    if location:
        slug_loc = urllib.parse.quote(re.sub(r"[^\w\s-]", "", location).strip().replace(" ", "-").lower())
        url = f"https://www.occ.com.mx/empleos/de-{slug_q}/en-{slug_loc}/"
    else:
        url = f"https://www.occ.com.mx/empleos/de-{slug_q}/"

    req = urllib.request.Request(url, headers=HEADERS)
    results = []
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # Extract cards
            card_blocks = re.findall(r'<div[^>]*class="[^"]*vacancy-card\b[^"]*"[\s\S]*?</div>\s*</div>\s*</div>', html)
            if not card_blocks:
                # Fallback to broader match
                card_blocks = re.findall(r'<div[^>]*class="[^"]*vacancy-card__body[^"]*"[\s\S]*?</div>\s*</div>', html)

            # Extract items via regex
            titles = re.findall(r'class="[^"]*vacancy-card__title[^"]*">([^<]+)', html)
            companies = re.findall(r'class="[^"]*vacancy-card__company-text[^"]*">([^<]+)', html)
            salaries = re.findall(r'class="[^"]*vacancy-card__salary[^"]*">([^<]+)', html)
            locations = re.findall(r'class="[^"]*vacancy-card__location[^"]*">([\s\S]*?)<', html)
            links = re.findall(r'href="(/empleo/[^"]+)"', html)

            for i in range(min(limit, len(titles))):
                title = clean_text(titles[i])
                company = clean_text(companies[i]) if i < len(companies) else "Empresa Confidencial"
                salary = clean_text(salaries[i]) if i < len(salaries) else None
                loc = clean_text(locations[i]) if i < len(locations) else (location or "México")
                link = f"https://www.occ.com.mx{links[i]}" if i < len(links) else url

                job_id = links[i].split("/")[-1] if i < len(links) else f"occ-{i+1}"

                results.append({
                    "id": f"occ-{job_id}",
                    "title": title,
                    "company": company,
                    "location": loc,
                    "date": None,
                    "url": link,
                    "salary": salary,
                    "source": "OCCMundial",
                    "description": f"{title} en {company} ({loc}). Salario: {salary or 'No mostrado'}."
                })
    except Exception as e:
        sys.stderr.write(f"OCC search warning: {e}\n")
    return results

def search_computrabajo(query: str, location: str = "", limit: int = 15):
    slug_q = urllib.parse.quote(re.sub(r"[^\w\s-]", "", query).strip().replace(" ", "-").lower())
    if location:
        slug_loc = urllib.parse.quote(re.sub(r"[^\w\s-]", "", location).strip().replace(" ", "-").lower())
        url = f"https://mx.computrabajo.com/trabajo-de-{slug_q}-en-{slug_loc}"
    else:
        url = f"https://mx.computrabajo.com/trabajo-de-{slug_q}"

    req = urllib.request.Request(url, headers=HEADERS)
    results = []
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # Extract links and titles
            matches = re.findall(r'<a[^>]*class="[^"]*js-o-link[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]+)</a>', html)
            companies = re.findall(r'class="[^"]*fc_base[^"]*"[^>]*>([^<]+)', html)
            
            for i, (link, title_raw) in enumerate(matches[:limit]):
                title = clean_text(title_raw)
                full_link = f"https://mx.computrabajo.com{link}" if link.startswith("/") else link
                company = clean_text(companies[i]) if i < len(companies) else "Empresa Confidencial"
                job_id = link.split("/")[-1].replace(".html", "")

                results.append({
                    "id": f"computrabajo-{job_id}",
                    "title": title,
                    "company": company,
                    "location": location or "México",
                    "date": None,
                    "url": full_link,
                    "salary": None,
                    "source": "Computrabajo",
                    "description": f"{title} en {company}. Vacante activa en Computrabajo México."
                })
    except Exception as e:
        sys.stderr.write(f"Computrabajo warning: {e}\n")
    return results

def fetch_detail(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            title_match = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", html, re.I)
            title = clean_text(title_match.group(1)) if title_match else "Detalle de Vacante"
            # Extract body
            body = clean_text(html)[:4000]
            return {
                "title": title,
                "url": url,
                "description": body
            }
    except Exception as e:
        return {"error": str(e), "url": url}

def main():
    parser = argparse.ArgumentParser(description="Buscar vacantes en portales de empleo de México (OCC, Computrabajo)")
    subparsers = parser.add_subparsers(dest="command")

    search_parser = subparsers.add_parser("search", help="Buscar vacantes")
    search_parser.add_argument("-q", "--query", default="", help="Palabras clave o título del puesto")
    search_parser.add_argument("-l", "--location", default="", help="Ciudad o estado (ej. CDMX, Guadalajara, Remoto)")
    search_parser.add_argument("-p", "--portal", choices=["occ", "computrabajo", "all"], default="all", help="Portal a consultar")
    search_parser.add_argument("-n", "--limit", type=int, default=20, help="Límite de resultados")
    search_parser.add_argument("-f", "--format", choices=["json", "table", "plain"], default="json", help="Formato de salida")

    detail_parser = subparsers.add_parser("detail", help="Obtener detalle de una vacante")
    detail_parser.add_argument("url", help="URL de la vacante")
    detail_parser.add_argument("-f", "--format", choices=["json", "plain"], default="json")

    args = parser.parse_args()

    if args.command == "search":
        all_results = []
        if args.portal in ("occ", "all"):
            all_results.extend(search_occ(args.query, args.location, limit=args.limit))
        if args.portal in ("computrabajo", "all"):
            all_results.extend(search_computrabajo(args.query, args.location, limit=args.limit))

        if args.limit > 0:
            all_results = all_results[:args.limit]

        if args.format == "table":
            if not all_results:
                print("No se encontraron resultados.")
                return
            header = f"{'PORTAL':<14} {'TÍTULO':<35} {'EMPRESA':<22} {'SALARIO':<22}"
            print(header)
            print("-" * len(header))
            for r in all_results:
                port = r.get("source", "")[:13]
                title = r.get("title", "")[:34]
                comp = (r.get("company") or "")[:21]
                sal = (r.get("salary") or "No publicado")[:21]
                print(f"{port:<14} {title:<35} {comp:<22} {sal:<22}")
        elif args.format == "plain":
            for r in all_results:
                print(f"[{r.get('source')}] {r.get('title')}")
                print(f"  Empresa: {r.get('company')} | Ubicación: {r.get('location')}")
                if r.get('salary'):
                    print(f"  Salario: {r.get('salary')}")
                print(f"  URL: {r.get('url')}\n")
        else:
            payload = {
                "meta": {
                    "count": len(all_results),
                    "query": args.query,
                    "location": args.location,
                    "portal": args.portal
                },
                "results": all_results
            }
            print(json.dumps(payload, indent=2, ensure_ascii=False))

    elif args.command == "detail":
        det = fetch_detail(args.url)
        if args.format == "plain":
            print(f"{det.get('title')}\nURL: {det.get('url')}\n\n{det.get('description')}")
        else:
            print(json.dumps(det, indent=2, ensure_ascii=False))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
