# use image part also 

import wikipedia
import wikipediaapi
from urllib.parse import urlparse, unquote


class wiki_search: 
    def __init__(self, user_agent = "MyApp/1.0"):
        self.wiki = wikipediaapi.Wikipedia(language='en', user_agent=user_agent)
        
    def get_title(self, url):
        path = urlparse(url).path
        title = unquote(path.split('/wiki/')[-1])
        return (title.replace('_', ' '))

    def search_page(self , query):
        if query.startswith("http"):
            title = self.get_title(query)
        else:
            search_results1 = wikipedia.search(query)
            if not search_results1:
                return {"title":None , "content":None}
            title = search_results1[0]
        
        page1 = self.wiki.page(title)
        if not page1.exists():
            return {"title":None , "content":None}
        
        return {"title":page1.title , "content":page1.text}
    
    def get_sections(self , query):
        data = self.search_page(query)
        if not data["title"] or not data["content"]:
            return None
        
        page = self.wiki.page(data["title"])
        sections = page.sections

        output = []

        # def a1(sections):
        #     out = {}
        #     for s in sections:
        #         out[s.title] = {
        #             "text": s.text,
        #             "subsections": a1(s.sections)
        #         }
        #     return out

        def a1(sections , prefix=""):
            for i in sections:
                path = prefix + i.title
                # output[path] = i.text
                # output[text] = i.text
                output.append({"title_path":path , "text":i.text})
                if i.sections:
                    a1(i.sections , path + " > ")

        # return a1(sections)
        a1(sections)
        return output   
        