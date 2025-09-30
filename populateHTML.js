function createCustomHTML(selectedInfo, recipeData, subheadingData){
    let customHtml = `
            <div class='results-box pdf-flex-column'>
            `
            if ((JSON.stringify(selectedInfo)).includes('title')){
                customHtml = customHtml + `<h1>${recipeData.title}</h1>`;
            }

            customHtml = customHtml + '<header>';
            if ((JSON.stringify(selectedInfo)).includes('servings')){
                customHtml = customHtml + `<p id="servings">${recipeData.servings}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('author')){
                customHtml = customHtml + `<p id="author">${recipeData.author}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('link')){
                customHtml = customHtml + `<p id="link"><a href=${recipeData.link} target="_blank">See More</a></p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('prep-time')){
                customHtml = customHtml + `<p id="prep-time">${recipeData.prep_time}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('cook-time')){
                customHtml = customHtml + `<p id="cook-time">${recipeData.cook_time}</p>`;
            }

            if ((JSON.stringify(selectedInfo)).includes('total-time')){
                customHtml = customHtml + `<p id="total-time">${recipeData.total_time}</span>`;
            }

            customHtml = customHtml + '</header><div id="pdf-main-recipe">';

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
            

            
            customHtml = customHtml + `
                </div></div>
            `;
    return customHtml;
}

