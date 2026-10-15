#!/usr/bin/env node
/**
 * CLI for searching tech and digital jobs on Get on Board (Mexico, LATAM & Remote)
 * Zero external dependencies. Runs with Bun or Node.js.
 */

interface JobItem {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
  salary: string | null
  remote: boolean
  description: string | null
}

function stripHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function parseFlags(argv: string[]) {
  const flags: Record<string, any> = { _: [] }
  const alias: Record<string, string> = {
    q: "query",
    c: "country",
    l: "location",
    n: "limit",
    r: "remote",
    f: "format",
  }

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const clean = a.replace(/^-+/, "")
      const key = alias[clean] ?? clean
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      flags._.push(a)
    }
  }
  return flags
}

async function searchJobs(flags: Record<string, any>): Promise<number> {
  const query = flags.query || ""
  const page = parseInt(flags.page || "1", 10)
  const limit = parseInt(flags.limit || "20", 10)
  const format = flags.format || "json"
  const countryFilter = (flags.country || flags.location || "").toLowerCase().trim()
  const remoteOnly = flags.remote === true || flags.remote === "true"

  const apiUrl = `https://www.getonbrd.com/api/v0/search/jobs?query=${encodeURIComponent(query)}&page=${page}&per_page=50`

  try {
    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "JobSearchMexico/1.0" },
    })

    if (!res.ok) {
      process.stderr.write(JSON.stringify({ error: `API error ${res.status}: ${res.statusText}`, code: "API_ERROR" }) + "\n")
      return 1
    }

    const data = await res.json()
    const rawJobs = data.data || []

    let jobs: JobItem[] = rawJobs.map((item: any) => {
      const attr = item.attributes || {}
      const countries: string[] = attr.countries || []
      const isRemote = Boolean(attr.remote)

      let salaryStr: string | null = null
      if (attr.min_salary || attr.max_salary) {
        salaryStr = `$${attr.min_salary ?? "?"} - $${attr.max_salary ?? "?"} USD/mes`
      }

      let fullDesc = [
        attr.description_headline ? `### ${attr.description_headline}` : "",
        attr.description ? stripHtml(attr.description) : "",
        attr.functions_headline ? `### ${attr.functions_headline}` : "",
        attr.functions ? stripHtml(attr.functions) : "",
        attr.desirable_headline ? `### ${attr.desirable_headline}` : "",
        attr.desirable ? stripHtml(attr.desirable) : "",
        attr.benefits_headline ? `### ${attr.benefits_headline}` : "",
        attr.benefits ? stripHtml(attr.benefits) : "",
      ]
        .filter(Boolean)
        .join("\n\n")

      const locParts: string[] = []
      if (countries.length > 0) locParts.push(countries.join(", "))
      if (isRemote) locParts.push("Remote")

      return {
        id: item.id,
        title: attr.title || "(Sin título)",
        company: attr.company?.data?.attributes?.name || item.links?.public_url?.split("/")[4]?.split("-")[0] || "Empresa Confidencial",
        location: locParts.join(" / ") || "México / Latam",
        date: attr.published_at ? new Date(attr.published_at * 1000).toISOString().slice(0, 10) : null,
        url: item.links?.public_url || `https://www.getonbrd.com/jobs/${item.id}`,
        salary: salaryStr,
        remote: isRemote,
        description: fullDesc,
      }
    })

    // Filter by country if specified
    if (countryFilter) {
      jobs = jobs.filter((j) => {
        const loc = (j.location || "").toLowerCase()
        const desc = (j.description || "").toLowerCase()
        return loc.includes(countryFilter) || (countryFilter === "mexico" && (loc.includes("remote") || desc.includes("méxico") || desc.includes("mexico")))
      })
    }

    if (remoteOnly) {
      jobs = jobs.filter((j) => j.remote)
    }

    if (limit > 0) {
      jobs = jobs.slice(0, limit)
    }

    if (format === "table") {
      if (jobs.length === 0) {
        process.stdout.write("No se encontraron vacantes.\n")
      } else {
        const header = "ID".padEnd(20) + " " + "TÍTULO".padEnd(35) + " " + "UBICACIÓN".padEnd(20) + " FECHA"
        const divider = "-".repeat(header.length)
        const rows = jobs.map((j) => {
          const id = j.id.slice(0, 19).padEnd(20)
          const title = j.title.slice(0, 34).padEnd(35)
          const loc = (j.location || "—").slice(0, 19).padEnd(20)
          const date = j.date || "—"
          return `${id} ${title} ${loc} ${date}`
        })
        process.stdout.write([header, divider, ...rows].join("\n") + "\n")
      }
    } else if (format === "plain") {
      process.stdout.write(
        jobs
          .map((j) => `${j.title}\n  ${j.company || "—"} · ${j.location || "—"} · ${j.date || "—"}\n  ${j.salary || ""}\n  url: ${j.url}`)
          .join("\n\n") + "\n"
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: { count: jobs.length, page, total: data.meta?.total_pages || 1 },
            results: jobs,
          },
          null,
          2
        ) + "\n"
      )
    }
    return 0
  } catch (err: any) {
    process.stderr.write(JSON.stringify({ error: err.message, code: "SEARCH_FAILED" }) + "\n")
    return 1
  }
}

async function getJobDetail(flags: Record<string, any>): Promise<number> {
  const target = flags._[1]
  if (!target) {
    process.stderr.write(JSON.stringify({ error: "Missing job id or url", code: "MISSING_ARG" }) + "\n")
    return 1
  }

  const slug = target.replace(/^https?:\/\/[^/]+\/jobs\//, "").replace(/\?.*$/, "")
  const url = `https://www.getonbrd.com/jobs/${slug}`

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      },
    })

    if (!res.ok) {
      process.stderr.write(JSON.stringify({ error: `Failed to fetch job detail (${res.status})`, code: "FETCH_FAILED" }) + "\n")
      return 1
    }

    const html = await res.text()
    // Extract title from <title> or <h1>
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i)
    const title = titleMatch ? stripHtml(titleMatch[1]).replace(/ - Get on Board.*/, "") : slug

    // Extract body content
    const bodyMatch = html.match(/<div class="content-body[^>]*>([\s\S]*?)<\/div>/i) || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    const body = bodyMatch ? stripHtml(bodyMatch[1]) : stripHtml(html).slice(0, 2000)

    const format = flags.format || "json"
    if (format === "plain") {
      process.stdout.write(`${title}\nURL: ${url}\n\n${body}\n`)
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            id: slug,
            title,
            url,
            description: body,
          },
          null,
          2
        ) + "\n"
      )
    }
    return 0
  } catch (err: any) {
    process.stderr.write(JSON.stringify({ error: err.message, code: "DETAIL_FAILED" }) + "\n")
    return 1
  }
}

async function main() {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = flags._[0]

  if (cmd === "search") {
    const code = await searchJobs(flags)
    process.exit(code)
  } else if (cmd === "detail") {
    const code = await getJobDetail(flags)
    process.exit(code)
  } else {
    process.stdout.write(`Uso:
  node cli.ts search -q "<query>" [-c "<country>"] [--remote true] [--format table|json|plain]
  node cli.ts detail <id|url> [--format plain|json]
`)
    process.exit(0)
  }
}

main()
