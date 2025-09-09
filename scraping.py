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


recipe_name=""
ingredients_array = []
directions_array = []
serving_size=""
author=""
link=""
prep_time=""
cook_time=""
total_time=""


# wordpress_classes = ['saltandlavender', 'cookingclassy', 'crazyforcrust', 
#                      'iheartnaptime', 'ourbestbites', 'scientificallysweet', 
#                      'asassyspoon', 'alwayseatdessert', 'aspicyperspective', 
#                      'bakedbyanintrovert', 'biggerbolderbaking', 'blessthismessplease', 
#                      'savorandsmile', 'foreignfork', 'thedomesticspoon', 'browneyedbaker',
#                      'cookingwithkarli', 'cookwithmanali', 'cozypeachkitchen', 'dinneratthezoo',
#                      'displacedhousewife', 'easygayoven', 'easydinnerideas', 'easyfamilyrecipes',
#                      'favfamilyrecipes', 'fearlessdining', 'feelgoodfoodie',
#                      'foodiecrush', 'girlwiththeironcast', 'gluesticksblog', 'grilledcheesesocial',
#                      'healthygirlkitchen', 'ihearteating', 'jessiebakestreats', 'katiebirdbakes']


#get url from the form
data = json.loads(sys.argv[1])
url=data.get('recipe', '')
recipe_link=url
inputMethod = data.get('inputMethod')

# url="https://www.allrecipes.com/recipe/228498/slow-cooker-baby-back-ribs/"
# inputMethod='text'

headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    }
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')


def checkURL():
    # if any(item in url for item in wordpress_classes):
    #      output = True
    wordpress = soup.find("div", class_=re.compile("wprm",flags=re.IGNORECASE))
    if wordpress:
         return True
    

if inputMethod == 'url':
    try:
        scraper = scrape_me(url)
        # scraper.to_json()
        # for a complete list of methods:
        # help(scraper)
        # Collect data into structured format
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

        recipe_data = {
            "title": scraper.title() if scraper else "",
            "ingredients": scraper.ingredients() if scraper else "",
            "directions": scraper.instructions_list() if scraper else "",
                    
            "servings": scraper.yields() if scraper else "",
            "author": scraper.author() if scraper else "",
            "link": scraper.canonical_url() if scraper else"",

            "prep_time": prep_time if scraper else "",
            "cook_time": cook_time if scraper else "",
            "total_time": total_time if scraper else "",

            "image": scraper.image() if scraper else "",

        }
    except:
        if checkURL():
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

            recipe_link = url

            author = soup.find("span", class_="wprm-recipe-author")
            if not (isinstance(author, str)) and author:
                author = author.text.strip()

        recipe_data = {
            "title": recipe_name if recipe_name else "",
            "ingredients": ingredients_array if ingredients_array else [],
            "directions": directions_array if directions_array else [],

            "servings": serving_size +' Servings' if serving_size else "",
            "author": author,
            "link": recipe_link,

            "prep_time": prep_time,
            "cook_time": cook_time,
            "total_time": total_time,
        }


if inputMethod == 'text':
        recipe_data = {
            "title": "Manual Recipe Entry",
            "ingredients": [],
            "directions": [],
            "servings": "",
            "author": "",
            "link": "",
            "prep_time": "",
            "cook_time": "",
            "total_time": "",
        }

print(json.dumps(recipe_data))

