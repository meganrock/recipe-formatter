from bs4 import BeautifulSoup
import requests
import re
import time
import json
import sys
from urllib.parse import urlparse, urlunparse


url="https://scientificallysweet.com/chocolate-peanut-butter-granola/#recipe"

# data = json.loads(sys.argv[1])

# #unformatted data collected by the form
# url=data.get('recipe', '')

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
serving_size=""
ingredient_array = []
directions_array = []
wordpress_classes = ['saltandlavender', 'cookingclassy', 'crazyforcrust', 
                     'iheartnaptime', 'ourbestbites', 'scientificallysweet', 
                     'asassyspoon', 'alwayseatdessert', 'aspicyperspective', 
                     'bakedbyanintrovert', 'biggerbolderbaking', 'blessthismessplease', 
                     'savorandsmile', 'foreignfork', 'thedomesticspoon']


headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    }
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')


# def checkWPAdmin(url):
#     parsed_url = urlparse(url)
#     # Reconstruct the URL using only the scheme and netloc components
#     stripped_url = urlunparse((parsed_url.scheme, parsed_url.netloc, '', '', '', ''))
#     stripped_url=stripped_url+'/wp-admin'
#     response = requests.head(stripped_url, timeout=5) # Add a timeout for robustness
#     if response.status_code != 404:
#         return True
#     else:
#             return False

def checkURL(url):
    for item in wordpress_classes:
        if item in url:
            output = True
        else:
            output = False
    return output


# if ("saltandlavender" in url) or ("cookingclassy" in url) or ("iheartnaptime" in url) :
# if (checkURL(url)):
if True:
    print("wordpress")
    recipe_name = soup.find(header_tags, class_="wprm-recipe-name")
    print(recipe_name)
    serving_size = soup.find("span", class_="wprm-recipe-servings")
    print(serving_size)
    # serving_size = soup.find("span", class_=re.compile("wprm-recipe-servings", flags=re.IGNORECASE))
    # serving_size = soup.next_sibling("span", class_=re.compile("wprm-recipe-servings", flags=re.IGNORECASE))
    # print(serving_size)
    # prep_time = soup.find("span", class_="wprm-recipe-prep_time")

    if (soup.find("span", class_="wprm-recipe-prep_time-hours")):
            prep_time = soup.find("span", class_="wprm-recipe-prep_time-hours")
            if (soup.find("span", class_="wprm-recipe-prep_time-hours")):
                prep_time.append(" ")
                prep_time.append(soup.find("span", class_="wprm-recipe-prep_time-minutes"))
    elif not (soup.find("span", class_="wprm-recipe-prep_time-hours")):
            prep_time = (soup.find("span", class_="wprm-recipe-prep_time-minutes"))

    # print(prep_time.text.strip())
    cook_time = soup.find("span", class_="wprm-recipe-cook_time")

    if (soup.find("span", class_="wprm-recipe-cook_time-hours")):
            cook_time = soup.find("span", class_="wprm-recipe-cook_time-hours")
            if (soup.find("span", class_="wprm-recipe-cook_time-minutes")):
                cook_time.append(" ")
                cook_time.append(soup.find("span", class_="wprm-recipe-cook_time-minutes"))
    elif not (soup.find("span", class_="wprm-recipe-cook_time-hours")) and (soup.find("span", class_="wprm-recipe-cook_time-minutes")):
            cook_time = (soup.find("span", class_="wprm-recipe-cook_time-minutes"))

    # print(cook_time.text.strip())

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
    print(ingredients_array)


    # directions_ul = soup.find("ul", class_="wprm-recipe-instructions")
    directions_array = []
    directions_list = (soup.find_all("li", class_="wprm-recipe-instruction"))
    for item in directions_list:
        # text = re.sub(ugly_characters, "", item.text.strip())
        directions_array.append(item.text.strip())
    # print(directions_array)

    recipe_link = url

    author = soup.find("span", class_="wprm-recipe-author")
    # print(author.text.strip())

    # img = soup.find("div", class_="wprm-recipe-image")

    # img = img.find_next("img")
    # src = img.get('src')

    # print(src)







# # get the title header
# recipe_name = soup.find(header_tags)
# # recipe_name= soup.find(header_tags, class_=re.compile(title_keywords,flags=re.IGNORECASE))
# # if(recipe_name==""):
# #     recipe_name = soup.find(header_tags)
# # print(f'{recipe_name.text}\n')

# #get the servings
# servings = recipe_name.find_next(servings_tags, string=re.compile(servings_keywords, flags=re.IGNORECASE))
# # servings = recipe_name.find_next(string=re.compile("servings", flags=re.IGNORECASE))
# number_match = re.search("(\d+(?:-\d+)?)", servings.text, flags=re.IGNORECASE)
# if (number_match):
#     # serving_size = re.sub(number_match.group(), "", servings.text)
#     serving_size = number_match.group()
# elif (not number_match):
#     serving_size = servings.find_next_sibling(servings_tags)
#     serving_size = serving_size.text

# # print(f'Serves: {serving_size}\n')


# #get the ingredients header
# ingredients_header = recipe_name.find_next(header_tags, class_=re.compile("ingredients", flags=re.IGNORECASE))
# if(not ingredients_header):
#     ingredients_header = recipe_name.find_next(header_tags, string=re.compile("ingredients", flags=re.IGNORECASE))
# # print(f'Ingredients\n')

# #get the directions header
# directions_header = recipe_name.find_next(header_tags, class_=re.compile(directions_keywords, flags=re.IGNORECASE))
# if(not directions_header):
#     directions_header = recipe_name.find_next(header_tags, string=re.compile(directions_keywords, flags=re.IGNORECASE))
# # print(f'Directions text: {directions_header.text}\n')


# #get ingredients list, checking for sublists
# def getIngredients(current):
#     safe = True
#     # print(current.text)
#     ingredient_array.append(current.text)
#     ingredient_ul = current.find_next(list_tags)
#     ingredients_list = (ingredient_ul.find_all("li"))
#     for parent in ingredient_ul.previous_elements:
#         if parent == directions_header:
#             safe = False
#     if safe:
#         for item in ingredients_list:
#             text = re.sub(ugly_characters, "", item.text.strip())
#             # ingredient_array.append(item.text.strip())
#             # print(item.text.strip())
#             # print(text.strip())
#             ingredient_array.append(text.strip())

# # getIngredients(ingredients_header)
# if (ingredients_header.find_next(header_tags) is directions_header):
#     getIngredients(ingredients_header)
# elif (ingredients_header.find_next(header_tags) is not directions_header):
#     #handle first ingredient UL, which sometimes has a subheading but sometimes doesn't
#     next_header = ingredients_header.find_next(header_tags)
#     first_ingredient_ul = ingredients_header.find_next(list_tags)
#     for parent in first_ingredient_ul.previous_elements:
#         if parent == next_header:
#             no_subheading = False
#     if no_subheading:
#         getIngredients(ingredients_header)
#     remaining_headers = ingredients_header.find_all_next(header_tags)
#     for header in remaining_headers:
#         if (header is not directions_header):
#             getIngredients(header)
#         if header is directions_header:
#             break

# ingredient_ul= ingredients_header.find_next("ul")


# # print(f'\nDirections\n')
# directions_ol= directions_header.find_next(list_tags)
# directions_list = (directions_ol.find_all("li"))

# for item in directions_list:
#     has_a_paragraph = item.find('p')
#     has_a_span = item.find('span')
#     if has_a_paragraph:
#         directions_array.append(has_a_paragraph.text.strip())
#     elif has_a_span:
#         if(has_a_span.text):
#             directions_array.append(has_a_span.text.strip())
#         else:
#             directions_array.append(item.text.strip())
#     else:
#         directions_array.append(item.text.strip())

# # for index, item in enumerate(directions_array):
#     # item = re.sub("step \d+", "", item, flags=re.IGNORECASE)
#     # print(f'{index+1}. {item}')



recipe_data = {
    "title": recipe_name.text.strip() if recipe_name else "",
    "servings": serving_size.text.strip()+ 'Servings',
    "ingredients": ingredients_array,
    "directions": directions_array if directions_array else ""
}

print(json.dumps(recipe_data))
# print(recipe_data["title"])
# print(recipe_data["servings"])
# print(recipe_data["ingredients"])
# print(recipe_data["directions"])









# def strip_url_paths(url):
#     """
#     Strips the path, parameters, query, and fragment from a URL,
#     leaving only the scheme, network location, and port.
#     """
#     parsed_url = urlparse(url)
#     # Reconstruct the URL using only the scheme and netloc components
#     stripped_url = urlunparse((parsed_url.scheme, parsed_url.netloc, '', '', '', ''))
#     stripped_url=stripped_url+'/wp-admin'


#     return stripped_url

# print(strip_url_paths(url))

# def check_website_exists(url):
#         # try:
#         #     # Send a HEAD request to get only the headers, saving bandwidth
#         #     response = requests.head(url, timeout=5) # Add a timeout for robustness
            
#         #     # Check if the status code indicates success (2xx range)
#         #     if 200 <= response.status_code < 300:
#         #         print(f"The website at {url} exists and is reachable.")
#         #         return True
#         #     else:
#         #         print(f"The website at {url} returned status code {response.status_code}.")
#         #         return False
#         # except requests.exceptions.ConnectionError:
#         #     print(f"Could not connect to {url}. The website might not exist or is unreachable.")
#         #     return False
#         # except requests.exceptions.Timeout:
#         #     print(f"Timeout occurred while trying to connect to {url}.")
#         #     return False
#         # except requests.exceptions.RequestException as e:
#         #     print(f"An error occurred while checking {url}: {e}")
#         #     return False
#         response = requests.head(url, timeout=5) # Add a timeout for robustness
#         if response.status_code != 404:
#             return True
#         else:
#              return False
    
# print(check_website_exists(strip_url_paths("https://ourbestbites.com/air-fryer-crumble-topping/")))