import wikipediaapi

wiki = wikipediaapi.Wikipedia(
    language='en',
    user_agent='MyWikiSummarizerBot/1.0'
)

page = wiki.page("best selling books")

print(page.title)
# print(page.text[:1000])  # first 1000 characters
print(len(page.text))  # length of the text


def get_data(topic : str):
    page = wiki.page(topic)
    if page.exists():
        return page.text
    else:
        return "No data found"