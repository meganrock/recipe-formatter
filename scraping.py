from bs4 import BeautifulSoup
import requests
import re
import time
import json
import sys
from recipe_scrapers import scrape_me
import subprocess


header_tags = ["h1", "h2", "h3", "h4", "h5", "h6"]
ugly_characters = '▢' 


#get url from the form

# url="https://www.allrecipes.com/recipe/228498/slow-cooker-baby-back-ribs/"
# inputMethod='text'



def checkURL(soup):
    wordpress = soup.find("div", class_=re.compile("wprm",flags=re.IGNORECASE))
    if wordpress:
         return True

def recipe_scraper(url):
    try:
        scraper = scrape_me(url)
        recipe_name=""
        ingredients_array = []
        directions_array = []
        serving_size=""
        author=""
        link=""
        prep_time=""
        cook_time=""
        total_time=""

        prep_time = int(scraper.prep_time())
        prep_time_hours = int(prep_time/60)
        prep_time_min = int(prep_time%60)
        if prep_time_hours and prep_time_min:
            prep_time = str(prep_time_hours)+' hours '+str(prep_time_min)+' mins'
        elif prep_time_hours and not prep_time_min:
            prep_time = str(prep_time_hours)+' hours'
        elif not prep_time_hours and prep_time_min:
            prep_time= str(prep_time_min)+' mins'

        cook_time = int(scraper.cook_time())
        cook_time_hours = int(cook_time/60)
        cook_time_min = int(cook_time%60)
        if cook_time_hours and cook_time_min:
            cook_time = str(cook_time_hours)+' hours '+str(cook_time_min)+' mins'
        elif cook_time_hours and not cook_time_min:
            cook_time = str(cook_time_hours)+' hours'
        elif not cook_time_hours and cook_time_min:
            cook_time = str(cook_time_min)+' mins'
        
        total_time = int(scraper.total_time())
        total_time_hours = int(total_time/60)
        total_time_min = int(total_time%60)
        if total_time_hours and total_time_min:
            total_time = str(total_time_hours)+' hours '+str(total_time_min)+' mins'
        elif total_time_hours and not total_time_min:
            total_time = str(total_time_hours)+' hours'
        elif not total_time_hours and total_time_min:
            total_time = str(total_time_min)+' mins'

        return {
            "title": scraper.title() if scraper else "",
            "ingredients": scraper.ingredients() if scraper else "",
            "directions": scraper.instructions_list() if scraper else "",
                    
            "servings": scraper.yields() if scraper else "",
            "author": 'Recipe by: ' + scraper.author() if scraper else "",
            "link": scraper.canonical_url() if scraper else "",

            "prep_time": 'Prep Time: ' + prep_time if scraper else "",
            "cook_time": 'Cook Time: ' + cook_time if scraper else "",
            "total_time": 'Total Time: ' + total_time if scraper else "",

            "image": scraper.image() if scraper else "",

        }
    except Exception as e:
        # Log the error for debugging
        print(f"Recipe scrapers failed: {str(e)}", file=sys.stderr)
        return None
    
def wordpress_scraper(url, soup):
    try:
        recipe_name=""
        ingredients_array = []
        directions_array = []
        serving_size=""
        author=""
        link=""
        prep_time=""
        cook_time=""
        total_time=""

        recipe_name = soup.find(header_tags, class_="wprm-recipe-name")
        if not (isinstance(recipe_name, str)) and recipe_name:
            recipe_name = recipe_name.text.strip()

        serving_size = soup.find("span", class_="wprm-recipe-servings")
        if not (isinstance(serving_size, str)) and serving_size:
            serving_size = serving_size.text.strip()

        if (soup.find("span", class_="wprm-recipe-prep_time-hours")):
                prep_time = soup.find("span", class_="wprm-recipe-prep_time-hours")
                if (soup.find("span", class_="wprm-recipe-prep_time-hours")):
                    prep_time.append(" ")
                    prep_time.append(soup.find("span", class_="wprm-recipe-prep_time-minutes"))
        elif not (soup.find("span", class_="wprm-recipe-prep_time-hours")):
                prep_time = (soup.find("span", class_="wprm-recipe-prep_time-minutes"))

        if not (isinstance(prep_time, str)) and prep_time:
            prep_time = prep_time.text.strip()

        cook_time = soup.find("span", class_="wprm-recipe-cook_time")

        if (soup.find("span", class_="wprm-recipe-cook_time-hours")):
                cook_time = soup.find("span", class_="wprm-recipe-cook_time-hours")
                if (soup.find("span", class_="wprm-recipe-cook_time-minutes")):
                    cook_time.append(" ")
                    cook_time.append(soup.find("span", class_="wprm-recipe-cook_time-minutes"))
        elif not (soup.find("span", class_="wprm-recipe-cook_time-hours")) and (soup.find("span", class_="wprm-recipe-cook_time-minutes")):
                cook_time = (soup.find("span", class_="wprm-recipe-cook_time-minutes"))
        
        if not (isinstance(cook_time, str)) and cook_time:
            cook_time = cook_time.text.strip()

        #getting total time
        if (soup.find("span", class_="wprm-recipe-total_time-hours")):
            total_time = soup.find("span", class_="wprm-recipe-total_time-hours")
            if (soup.find("span", class_="wprm-recipe-total_time-minutes")):
                total_time.append(" ")
                total_time.append(soup.find("span", class_="wprm-recipe-total_time-minutes"))
        elif not (soup.find("span", class_="wprm-recipe-total_time-hours")):
            total_time = (soup.find("span", class_="wprm-recipe-total_time-minutes"))


        if not (isinstance(total_time, str)) and total_time:
                total_time = total_time.text.strip()

        # ingredient_ul = soup.find("ul", class_="wprm-recipe-ingredients")
        ingredients_array = []
        ingredients_list = (soup.find_all("li", class_="wprm-recipe-ingredient"))
        for item in ingredients_list:
            text = re.sub(ugly_characters, "", item.text.strip())
            ingredients_array.append(text.strip())


        directions_array = []
        directions_list = (soup.find_all("li", class_="wprm-recipe-instruction"))
        for item in directions_list:
            text = re.sub(ugly_characters, "", item.text.strip())
            directions_array.append(item.text.strip())

        link = url

        author = soup.find("span", class_="wprm-recipe-author")
        if not (isinstance(author, str)) and author:
            author = author.text.strip()

        return {
                "title": recipe_name if recipe_name else "",
                "ingredients": ingredients_array if ingredients_array else [],
                "directions": directions_array if directions_array else [],

                "servings": serving_size +' servings' if serving_size else "",
                "author": 'Recipe by: ' + author if author else "",
                "link": link if link else "",

                "prep_time": 'Prep Time: ' + prep_time if prep_time else "",
                "cook_time": 'Cook Time: ' + cook_time if cook_time else "",
                "total_time": 'Total Time: ' + total_time if total_time else "",
            }
    except Exception as e:
        print(f"WordPress scraping failed: {str(e)}", file=sys.stderr)
        return None



def parse_recipe_text(recipe_text):
    try:
        recipe_name=""
        ingredients_array = []
        directions_array = []
        servings=""
        author=""
        link=""
        prep_time=""
        cook_time=""
        total_time=""

        # remove extra white lines
        result = re.sub(r"\n\n", r"\n", recipe_text, count=0, flags=re.MULTILINE)
        # # Removes unicode
        result = re.sub(r'[^\w\s\.,!?;:()\[\]{}"\'/-]', '', result, flags=re.UNICODE)

        # split up ingredients section
        result = re.split("Ingredients", result, flags=re.IGNORECASE, maxsplit=1)

        introduction = result[0]
        
        if(re.search("Directions", result[1], re.MULTILINE | re.IGNORECASE)):
            result = re.split("Directions", result[1],  flags=re.IGNORECASE, maxsplit=1)
        elif(re.search("Instructions", result[1], re.MULTILINE.IGNORECASE)):
            result = re.split("Instructions", result[1], flags=re.IGNORECASE, maxsplit=1)

        ingredients = result[0]
        directions = result[1]

        #split up introduction where lines got bunched together
        introduction = re.split("  |\n", introduction, maxsplit=0)

        for index, item in enumerate (introduction):
            if index == 0:
                recipe_name = item
            if(re.match(r'Yield:|Servings:|Serves:', item, re.IGNORECASE)):
                servings = re.split(': ', item)
                servings = servings[1]
                servings = re.sub('servings', '', servings, flags=re.IGNORECASE)
                servings = str(servings)
            elif(re.match(r'Recipe by:|Submitted by:', item, re.IGNORECASE)):
                author = re.split(': ', item)
                author = author[1]
            elif(re.match(r'Recipe by |Submitted by ', item, re.IGNORECASE)):
                author = re.split(' ', item)
                author = author[1]
            elif(re.match(r'Prep Time:', item, re.IGNORECASE)):
                prep_time = re.split(': ', item)
                prep_time = prep_time[1]
            elif(re.match(r'Cook Time:', item, re.IGNORECASE)):
                cook_time = re.split(': ', item)
                cook_time = cook_time[1]
            elif(re.match(r'Total Time:', item, re.IGNORECASE)):
                total_time = re.split(': ', item)
                total_time = total_time[1]

        # for index, item in enumerate (introduction):
        #     if (item == '') or (re.match(r"By|Author|Description", item, flags=re.MULTILINE.IGNORECASE)) or (re.match(r'^.*[.!?]', item, flags=re.MULTILINE)):
        #         introduction.pop(index)
    

        subheading_pattern = r'([^:]+:)'
        ingredient_pattern = r'(?:\d+(?:\.\d+)?|\d+/\d+|\d+\s+\d+/\d+)\s+.+'


        ingredients = re.split(r"\n", ingredients, maxsplit=0, flags=re.MULTILINE | re.IGNORECASE)

        for index, item in enumerate(ingredients):
            if item == '':
                ingredients.pop(index)
            # elif (re.match(ingredient_pattern, item)):
        for index, item in enumerate(ingredients):
                ingredients_array.append(item)


        # list directions without numbers
        # directions = re.sub(r'^\d*\.?\d+$', '', directions, flags=re.UNICODE)
        directions = re.split(r"\n", directions, maxsplit=0, flags=re.IGNORECASE | re.MULTILINE)
        
        for index, item in enumerate(directions):
            if item == '':
                directions.pop(index)
        for index, item in enumerate(directions):
            # print(f"{index+1}. {item}")
            if re.match(r'^\d*\.?\d+$', item, flags=re.IGNORECASE):
                item = re.sub(r'^\d*\.?\d+$', '', item, flags=re.UNICODE | re.IGNORECASE)
            directions_array.append(item)

        return {
            "title": recipe_name if recipe_name else "",
            "ingredients": ingredients_array if ingredients_array else [],
            "directions": directions_array if directions_array else [],

            "servings": servings +' servings' if servings else "",
            "author": 'Recipe by: ' + author if author else "",
            "link": link if link else "",

            "prep_time": 'Prep Time: ' + prep_time if prep_time else "",
            "cook_time": 'Cook Time: ' + cook_time if cook_time else "",
            "total_time": 'Total Time: ' + total_time if total_time else "",
        }
    except Exception as e:
        print(f"Text parsing failed: {str(e)}", file=sys.stderr)
        return {"error": f"Text parsing failed: {str(e)}"}


# main execution
try:
    data = json.loads(sys.argv[1])
    inputMethod = data.get('inputMethod')

    if inputMethod == 'url':  
        url=data.get('recipe', '').strip()
        if not url:
            recipe_data = {"error": "No URL provided"}
        else:
            # First try recipe_scrapers
            recipe_data = recipe_scraper(url)

            if not recipe_data:
                try:
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
                    }
                    response = requests.get(url, headers=headers)
                    soup = BeautifulSoup(response.content, 'html.parser')

                    if checkURL(soup):
                        recipe_data=wordpress_scraper(url, soup)
                    if not recipe_data:
                        recipe_data = {"error": "Could not extract recipe from this URL"}
                        
                except requests.exceptions.Timeout:
                    recipe_data = {"error": "Request timed out - website took too long to respond"}
                except requests.exceptions.RequestException as e:
                    recipe_data = {"error": f"Network error: {str(e)}"}

    elif inputMethod == 'text':
        recipe_text=data.get('recipe', '').strip()
        if not recipe_text:
            recipe_data = {"error": "No recipe text provided"}
        else:
            recipe_data = parse_recipe_text(recipe_text)
    else:
        recipe_data = {"error": "Invalid input method"}
    
except json.JSONDecodeError:
    recipe_data = {"error": "Invalid JSON input"}
except Exception as e:
    recipe_data = {"error": f"Unexpected error: {str(e)}"}

    
print(json.dumps(recipe_data, indent=None))
