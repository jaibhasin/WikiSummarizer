from app.services.fetch_n_parse_wiki import wiki_search

wiki_service = wiki_search()

# 1. Fetch full page
data = wiki_service.search_page("Kanye")
# print(data["title"])
# print(data["content"][:500])

# 2. Fetch sections
sections = wiki_service.get_sections("Kanye")
print(sections)