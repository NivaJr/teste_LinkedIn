{
  "query": {{ JSON.stringify($node['Pesquisar'].json.output.search_string.replace(/[\r\n]+/g, " ").trim()) }},
  "limit": 10,
  "scrapeOptions": {
    "formats": ["markdown"]
  }
}
