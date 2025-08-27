from bs4 import BeautifulSoup
import requests
import re
import time
import json
import sys

data = json.loads(sys.argv[1])

#unformatted data collected by the form
url=data.get('recipe', '')

#constants
header_tags = ["h1", "h2", "h3", "h4", "h5", "h6"]
list_tags = ["ul", "ol"]
title_keywords = "title|heading|name"
directions_keywords = "directions|instructions|direction|instruction"
servings_tags = ["p", "span", "div"]
servings_keywords = "servings|serves|yield"
ugly_characters = '▢'


#initializing variables
paragraph = ""
has_a_paragraph = False
no_subheading = True
recipe_name=""
ingredient_array = []
directions_array = []

# url = "https://www.eatingwell.com/chicken-fajita-quesadillas-8379778?print"
url2 = "https://www.gimmesomeoven.com/beef-and-broccoli-recipe/63480/"
url3 = "https://www.foodiecrush.com/wprm_print/grilled-cilantro-lime-chicken-recipe"
url4="https://www.saltandlavender.com/easy-beef-and-noodles/"
url5="https://www.allrecipes.com/apple-cider-hawaiian-roll-donuts-recipe-11786958"


url6="https://www.food.com/recipe/tender-pot-roast-22137"
url7="https://www.delish.com/cooking/recipe-ideas/a63187724/mediterranean-white-beans-and-greens-recipe/"
url8="https://www.tasteofhome.com/recipes/quick-coq-au-vin/"


url9="https://www.modernhoney.com/chinese-orange-chicken/"
url10="https://www.iheartnaptime.net/burrito-bowls/"

headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    }
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')

# get the title header
recipe_name = soup.find(header_tags)
# recipe_name= soup.find(header_tags, class_=re.compile(title_keywords,flags=re.IGNORECASE))
# if(recipe_name==""):
#     recipe_name = soup.find(header_tags)
# print(f'{recipe_name.text}\n')

#get the servings
servings = recipe_name.find_next(servings_tags, string=re.compile(servings_keywords, flags=re.IGNORECASE))
# servings = recipe_name.find_next(string=re.compile("servings", flags=re.IGNORECASE))
number_match = re.search("(\d+(?:-\d+)?)", servings.text, flags=re.IGNORECASE)
if (number_match):
    # serving_size = re.sub(number_match.group(), "", servings.text)
    serving_size = number_match.group()
elif (not number_match):
    serving_size = servings.find_next_sibling(servings_tags)
    serving_size = serving_size.text

# print(f'Serves: {serving_size}\n')


#get the ingredients header
ingredients_header = recipe_name.find_next(header_tags, class_=re.compile("ingredients", flags=re.IGNORECASE))
if(not ingredients_header):
    ingredients_header = recipe_name.find_next(header_tags, string=re.compile("ingredients", flags=re.IGNORECASE))
# print(f'Ingredients\n')

#get the directions header
directions_header = recipe_name.find_next(header_tags, class_=re.compile(directions_keywords, flags=re.IGNORECASE))
if(not directions_header):
    directions_header = recipe_name.find_next(header_tags, string=re.compile(directions_keywords, flags=re.IGNORECASE))
# print(f'Directions text: {directions_header.text}\n')


#get ingredients list, checking for sublists
def getIngredients(current):
    safe = True
    # print(current.text)
    ingredient_array.append(current.text)
    ingredient_ul = current.find_next(list_tags)
    ingredients_list = (ingredient_ul.find_all("li"))
    for parent in ingredient_ul.previous_elements:
        if parent == directions_header:
            safe = False
    if safe:
        for item in ingredients_list:
            text = re.sub(ugly_characters, "", item.text.strip())
            # ingredient_array.append(item.text.strip())
            # print(item.text.strip())
            # print(text.strip())
            ingredient_array.append(text.strip())

# getIngredients(ingredients_header)
if (ingredients_header.find_next(header_tags) is directions_header):
    getIngredients(ingredients_header)
elif (ingredients_header.find_next(header_tags) is not directions_header):
    #handle first ingredient UL, which sometimes has a subheading but sometimes doesn't
    next_header = ingredients_header.find_next(header_tags)
    first_ingredient_ul = ingredients_header.find_next(list_tags)
    for parent in first_ingredient_ul.previous_elements:
        if parent == next_header:
            no_subheading = False
    if no_subheading:
        getIngredients(ingredients_header)
    remaining_headers = ingredients_header.find_all_next(header_tags)
    for header in remaining_headers:
        if (header is not directions_header):
            getIngredients(header)
        if header is directions_header:
            break

ingredient_ul= ingredients_header.find_next("ul")


# print(f'\nDirections\n')
directions_ol= directions_header.find_next(list_tags)
directions_list = (directions_ol.find_all("li"))

for item in directions_list:
    has_a_paragraph = item.find('p')
    has_a_span = item.find('span')
    if has_a_paragraph:
        directions_array.append(has_a_paragraph.text.strip())
    elif has_a_span:
        if(has_a_span.text):
            directions_array.append(has_a_span.text.strip())
        else:
            directions_array.append(item.text.strip())
    else:
        directions_array.append(item.text.strip())

# for index, item in enumerate(directions_array):
    # item = re.sub("step \d+", "", item, flags=re.IGNORECASE)
    # print(f'{index+1}. {item}')



# At the end of your soup.py, instead of printing everything:

# Collect data into structured format
recipe_data = {
    "title": recipe_name.text.strip() if recipe_name else "",
    "servings": serving_size,
    "ingredients": ingredient_array,  # You'll need to populate this array instead of printing
    "directions": directions_array
}

# Output as JSON instead of printing formatted text
print(json.dumps(recipe_data))