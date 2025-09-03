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
serving_size=""
ingredients_array = []
directions_array = []
wordpress_classes = ['saltandlavender', 'cookingclassy', 'crazyforcrust', 
                     'iheartnaptime', 'ourbestbites', 'scientificallysweet', 
                     'asassyspoon', 'alwayseatdessert', 'aspicyperspective', 
                     'bakedbyanintrovert', 'biggerbolderbaking', 'blessthismessplease', 
                     'savorandsmile', 'foreignfork', 'thedomesticspoon']


#get url from the form
data = json.loads(sys.argv[1])
url=data.get('recipe', '')


headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    }
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')


def checkURL(url):
    return any(item in url for item in wordpress_classes)




try:
    scraper = scrape_me(url)
    # scraper.to_json()
    # for a complete list of methods:
    # help(scraper)
    # Collect data into structured format
    recipe_data = {
        "title": scraper.title() if scraper else "",
        "image": scraper.image() if scraper else "",
        "servings": scraper.yields() if scraper else "",
        "ingredients": scraper.ingredients() if scraper else "",
        "directions": scraper.instructions_list() if scraper else "",
    }
except:
    if checkURL(url):
        recipe_name = soup.find(header_tags, class_="wprm-recipe-name")
        
        serving_size = soup.find("span", class_="wprm-recipe-servings")
        if not (isinstance(serving_size, str)):
             serving_size = serving_size.text.strip()

        if (soup.find("span", class_="wprm-recipe-prep_time-hours")):
                prep_time = soup.find("span", class_="wprm-recipe-prep_time-hours")
                if (soup.find("span", class_="wprm-recipe-prep_time-hours")):
                    prep_time.append(" ")
                    prep_time.append(soup.find("span", class_="wprm-recipe-prep_time-minutes"))
        elif not (soup.find("span", class_="wprm-recipe-prep_time-hours")):
                prep_time = (soup.find("span", class_="wprm-recipe-prep_time-minutes"))

        cook_time = soup.find("span", class_="wprm-recipe-cook_time")

        if (soup.find("span", class_="wprm-recipe-cook_time-hours")):
                cook_time = soup.find("span", class_="wprm-recipe-cook_time-hours")
                if (soup.find("span", class_="wprm-recipe-cook_time-minutes")):
                    cook_time.append(" ")
                    cook_time.append(soup.find("span", class_="wprm-recipe-cook_time-minutes"))
        elif not (soup.find("span", class_="wprm-recipe-cook_time-hours")) and (soup.find("span", class_="wprm-recipe-cook_time-minutes")):
                cook_time = (soup.find("span", class_="wprm-recipe-cook_time-minutes"))

        #getting total time
        if (soup.find("span", class_="wprm-recipe-total_time-hours")):
            total_time = soup.find("span", class_="wprm-recipe-total_time-hours")
            if (soup.find("span", class_="wprm-recipe-total_time-minutes")):
                total_time.append(" ")
                total_time.append(soup.find("span", class_="wprm-recipe-total_time-minutes"))
        elif not (soup.find("span", class_="wprm-recipe-total_time-hours")):
            total_time = (soup.find("span", class_="wprm-recipe-total_time-minutes"))


        # ingredient_ul = soup.find("ul", class_="wprm-recipe-ingredients")
        ingredients_array = []
        ingredients_list = (soup.find_all("li", class_="wprm-recipe-ingredient"))
        for item in ingredients_list:
            text = re.sub(ugly_characters, "", item.text.strip())
            ingredients_array.append(text.strip())


        directions_array = []
        directions_list = (soup.find_all("li", class_="wprm-recipe-instruction"))
        for item in directions_list:
            # text = re.sub(ugly_characters, "", item.text.strip())
            directions_array.append(item.text.strip())

        recipe_link = url

        author = soup.find("span", class_="wprm-recipe-author")

    recipe_data = {
    "title": recipe_name.text.strip() if recipe_name else "",
    "servings": serving_size+' Servings',
    "ingredients": ingredients_array if ingredients_array else [],
    "directions": directions_array if directions_array else [],
    }

    


# Output as JSON instead of printing formatted text
print(json.dumps(recipe_data))
