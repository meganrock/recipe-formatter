function createCustomHTML(selectedInfo, recipeData, subheadingData){
    let customHtml = `
            <div class='results-box'>
            `
            if ((JSON.stringify(selectedInfo)).includes('title')){
                customHtml = customHtml + `\n<h1>${recipeData.title}</h1>`;
            }

            customHtml = customHtml + '<header>';
            if ((JSON.stringify(selectedInfo)).includes('servings')){
                customHtml = customHtml + `\n<p>${recipeData.servings}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('author')){
                customHtml = customHtml + `\n<p>Recipe by: ${recipeData.author}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('link')){
                customHtml = customHtml + `\n<p><a href=${recipeData.link} target="_blank">See More</a></p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('prep-time')){
                customHtml = customHtml + `\n<p>Prep Time: ${recipeData.prep_time}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('cook-time')){
                customHtml = customHtml + `\n<p>Cook Time: ${recipeData.cook_time}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('total-time')){
                customHtml = customHtml + `\n<p>Total Time: ${recipeData.total_time}</span>`;
            }

            customHtml = customHtml + '</header>';

            if (!subheadingData){
                if ((JSON.stringify(selectedInfo)).includes('ingredients')){
                    customHtml = customHtml + `
                    <div class="ingredients">
                        <h2>Ingredients</h2>
                            <ul>
                                ${recipeData.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                    </div>`
                }
                if ((JSON.stringify(selectedInfo)).includes('directions')){
                    customHtml = customHtml + `
                    <div class="directions">
                        <h2>Directions</h2>
                            <ol>
                                ${recipeData.directions.map(direction => `<li>${direction}</li>`).join('')}
                            </ol>
                    </div>`
                }
            } else if (subheadingData){
                if ((JSON.stringify(selectedInfo)).includes('ingredients')){
                    customHtml = customHtml + `
                    <div class="ingredients">
                        <h2>Ingredients</h2>
                    `
                    if (subheadingData.ingredients_subheadings_count>0){
                        let subheadings_used = 0;
                        if(subheadingData.ingredients_array_splits.includes(-1)){
                            customHtml = customHtml + `
                            <h3>${subheadingData.ingredients_subheadings[subheadings_used]}</h3> ` 
                            subheadings_used = subheadings_used + 1;
                            }
                        customHtml = customHtml + `<ul>`
                        console.log(ingredients_array.length);
                        ingredients_array.forEach((ingredient, index) => {
                            console.log(index);
                            
                            if (!subheadingData.ingredients_array_splits.includes(index)){
                                customHtml = customHtml + `<li>${ingredient}</li>`
                            } else if (ingredients_array_splits.includes(index)){
                                customHtml = customHtml + `
                                <li>${ingredient}</li>
                                </ul>
                                <h3>${subheadingData.ingredients_subheadings[subheadings_used]}</h3>
                                <ul>
                                `
                                subheadings_used = subheadings_used + 1;
                            }
                            if (index == ingredients_array.length-1){
                                console.log('end of array');
                                customHtml = customHtml + `</ul>
                                </div>`
                            }
                        });
                    }else if (subheadingData.ingredients_subheadings_count == 0){
                        customHtml = customHtml +  `<ul>
                                ${ingredients_array.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                    </div>`
                }
            }
            if ((JSON.stringify(selectedInfo)).includes('directions')){
                customHtml = customHtml + `
                <div class="directions">
                    <h2>Directions</h2>`

                if (subheadingData.directions_subheadings_count>0){
                    let subheadings_used = 0;
                    if(subheadingData.directions_array_splits.includes(-1)){
                        customHtml = customHtml + `
                        <h3>${subheadingData.directions_subheadings[subheadings_used]}</h3> ` 
                        subheadings_used = subheadings_used + 1;
                        }
                    customHtml = customHtml + `<ul>`
                    console.log(directions_array.length);
                    directions_array.forEach((direction, index) => {
                        console.log(index);
                        
                        if (!subheadingData.directions_array_splits.includes(index)){
                            customHtml = customHtml + `<li>${direction}</li>`
                        } else if (subheadingData.directions_array_splits.includes(index)){
                            customHtml = customHtml + `
                            <li>${direction}</li>
                            </ul>
                            <h3>${subheadingData.directions_subheadings[subheadings_used]}</h3>
                            <ul>
                            `
                            subheadings_used = subheadings_used + 1;
                        }
                        if (index == directions_array.length-1){
                            customHtml = customHtml + `</ul>
                            </div>`
                        }
                    });
                }

                else if (subheadingData.directions_subheadings_count == 0){
                    customHtml = customHtml +  `<ol>
                            ${directions_array.map(direction => `<li>${direction}</li>`).join('')}
                        </ol>
                        
                </div>`
                }
            }
        }
            

            
            customHtml = customHtml + `\n
                </div>
            `;
    return customHtml;
}

