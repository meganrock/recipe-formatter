import sys
import time
import json
import re

# beautiful soup

data = json.loads(sys.argv[1])

#unformatted data collected by the form
unformatted=data.get('recipe', '')

# remove extra white lines
result = re.sub(r"\n\n", r"\n", unformatted, count=0, flags=re.MULTILINE)

# # Removes unicode
result = re.sub(r'[^\w\s\.,!?;:()\[\]{}"\'/-]', '', result, flags=re.UNICODE)

# print(result)
# website = r'[a-z0-9-]+\.(com|org)'
# test_website = re.match(website, result, re.IGNORECASE)
# print('website')
# print(test_website)

# split up ingredients section
result = re.split("Ingredients", result, maxsplit=1)

introduction = result[0]
print('introduction')
print(introduction)

#split up introduction where lines got bunched together
introduction = re.split("  |\n", introduction, maxsplit=0)
print(introduction)


for index, item in enumerate (introduction):
    if(re.match(r'Yield:|Servings:', item, re.IGNORECASE)):
        servings = re.split(': ', item)
        servings = servings[1]
    elif(re.match(r'. Time:', item, re.IGNORECASE)):
        total_time = item

print(f'Serves: {servings}')



# for index, item in enumerate (introduction):
#     if (item == '') or (re.match(r"By|Author|Description", item, flags=re.MULTILINE.IGNORECASE)) or (re.match(r'^.*[.!?]', item, flags=re.MULTILINE)):
#         introduction.pop(index)



recipe = result[1]
print('recipe')
print(recipe)

#split up directions 
#directions, instructions
if(re.search("Directions", result[1], re.MULTILINE)):
    result2 = re.split("Directions", result[1], maxsplit=1)
elif(re.search("Instructions", result[1], re.MULTILINE)):
    result2 = re.split("Instructions", result[1], maxsplit=1)

#ingredients
ingredients = result2[0]
ingredients = re.sub(r"\n", "", ingredients, count=0, flags=re.MULTILINE)

subheading_pattern = r'([^:]+:)'
ingredient_pattern = r'(?:\d+(?:\.\d+)?|\d+/\d+|\d+\s+\d+/\d+)\s+.+'
ingredients = re.split(r"\n", result2[0], maxsplit=0, flags=re.MULTILINE)

print("Ingredients")
for index, item in enumerate(ingredients):
    if item == '':
        ingredients.pop(index)
    elif (re.match(subheading_pattern, item)):
        print(item)
    elif (re.match(ingredient_pattern, item)):
        print(item)

print("\n")


# enjoy_pattern = r'enjoy!\n'
# testing = re.search(enjoy_pattern, result2[1], re.MULTILINE)
# print(testing)

# list directions with numbers
directions = re.split(r"\n", result2[1], maxsplit=0, flags=re.MULTILINE)
for index, item in enumerate(directions):
    if item == '':
        directions.pop(index)

print("Directions")
#print out directions
for index, item in enumerate(directions):
    print(f"{index+1}. {item}")

