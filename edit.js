//  
const toolbarOptions = [
// ['bold', 'italic', 'underline'],        // toggled buttons


[{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],
[{ 'list': 'ordered'}, { 'list': 'bullet' }],
['link', 'image'],
// [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

[{ 'header': [1, 2, 3, false] }],

// [{ 'color': [] }],          // dropdown with defaults from theme
// [{ 'align': [] }],

// ['clean']                                         // remove formatting button
];

const quill = new Quill('#editor', {
modules: {
    toolbar: toolbarOptions
},
theme: 'snow'
});



// const Parchment = Quill.import('parchment');
// const MyCustomClass = new Parchment.ClassAttributor('myCustomClass', 'results-box', {
// scope: Parchment.Scope.BLOCK, // or INLINE, depending on your needs
// });
// Quill.register(MyCustomClass, true);

const editHtml = localStorage.getItem('recipe-html')
let formatButton = document.getElementById('formatButton')
    quill.clipboard.dangerouslyPasteHTML(0, editHtml)

formatButton.addEventListener('click', function() {
    htmlContent = parseEditorHtml(quill.root.innerHTML)
    localStorage.setItem('recipe-html', htmlContent)
    window.location.href = "format.html";
})

function parseEditorHtml(editor_html){

    recipeName="";
    ingredients_list="";
    cook_time="";
    servings="";
    link="";
    in_ingredients = false;
    in_directions = false;
    prep_time="";
    cook_time="";
    total_time="";
    ingredients_array = [];
    directions_array = [];
    ingredients_array_splits = [];
    directions_array_splits = [];
    ingredients_subheadings = [];
    directions_subheadings = [];
    ingredients_subheadings_count = 0;
    directions_subheadings_count = 0;


    
    const parser = new DOMParser();
    const doc = parser.parseFromString(editor_html, 'text/html');

    const whole_doc = doc.querySelectorAll('*');
    whole_doc.forEach(item => {
        if (item.tagName=="H1"){
            recipe_name = item.textContent;
        } else if (item.tagName=="P"){
            if (item.textContent.toLowerCase().includes('servings')){
                servings = item.textContent;
            } else if (item.textContent.toLowerCase().includes('prep time')){
                prep_time = item.textContent;
            } else if (item.textContent.toLowerCase().includes('cook time')){
                cook_time = item.textContent;
            } else if (item.textContent.toLowerCase().includes('total time')){
                total_time = item.textContent;
            }
        } else if (item.tagName=="A"){
            link = item.textContent;
        } else if (item.tagName=="H2"){
            if (item.textContent.toLowerCase() == "ingredients"){
                in_ingredients = true;
                in_directions = false;
            }
            else if (item.textContent.toLowerCase() == "directions"){
                in_directions = true;
                in_ingredients = false;
            } 
        } else if (item.tagName=="H3"){
            if (in_ingredients){
                ingredients_subheadings_count = ingredients_subheadings_count + 1;
                ingredients_subheadings.push(item.textContent);
                ingredients_array_splits.push(ingredients_array.length-1);
                console.log(ingredients_subheadings);
                console.log(ingredients_subheadings_count);
                console.log(ingredients_array_splits);
            }
            
            else if (in_directions){
                directions_subheadings_count = directions_subheadings_count + 1;
                directions_subheadings.push(item.textContent);
                directions_array_splits.push(directions_array.length-1);
            }

        } else if (item.tagName=="LI"){
            if (in_ingredients){
                ingredients_array.push(item.textContent);
            }
            else if (in_directions){
                directions_array.push(item.textContent);
            }
        }
    });

recipeData = {
    "title": recipe_name,
    "ingredients": ingredients_array,
    "directions": directions_array,
    "servings": servings,
    "author": "",
    "link": link,
    "prep_time": prep_time,
    "cook_time": cook_time,
    "total_time": total_time,
}

let test_variable='hello it is megan!';

selectedInfo = [];
if (recipe_name){
    selectedInfo.push('title');
}

if (servings){
   selectedInfo.push('servings');
}
if (link){
    selectedInfo.push('link');
}

if (prep_time){
    selectedInfo.push('prep-time');
}

if (cook_time){
    selectedInfo.push('cook-time');
}

if (total_time){
    selectedInfo.push('total-time');
}

if (ingredients_array){
    selectedInfo.push('ingredients');
}
if (directions_array){
    selectedInfo.push('directions');
}

suheadingData = {
    "ingredients_subheadings_count": ingredients_subheadings_count,
    "ingredients_subheadings": ingredients_subheadings,
    "ingredients_array_splits": ingredients_array_splits,
    "directions_subheadings_count": directions_subheadings_count,
    "directions_subheadings": directions_subheadings,
    "directions_array_splits": directions_array_splits,
}

let customHtml = createCustomHTML(selectedInfo, recipeData, suheadingData);
    return customHtml;
}




//     let customHtml = `
//             <div class='results-box'>
//             `
    
//     if (recipe_name){
//         customHtml = customHtml + `\n<h1>${recipe_name}</h1>`;
//     }

//     if (servings){
//         customHtml = customHtml + `\n<p>${servings}</p>`;
//     }

//     // if ((JSON.stringify(selectedInfo)).includes('author')){
//     //     customHtml = customHtml + `\n<p>Recipe by: ${recipeData.author}</p>`;
//     // }

//     if (link){
//         customHtml = customHtml + `\n<p><a href=${link} target="_blank">See More</a></p>`;
//     }

//     if (prep_time){
//         customHtml = customHtml + `\n<p>Prep Time: ${prep_time}</p>`;
//     }

//     if (cook_time){
//         customHtml = customHtml + `\n<p>Cook Time: ${cook_time}</p>`;
//     }

//     if (total_time){
//         customHtml = customHtml + `\n<p>Cook Time: ${total_time}</p>`;
//     }



//     if (ingredients_array){
//         customHtml = customHtml + `
//         <div class="ingredients">
//             <h2>Ingredients</h2>
//         `
//         if (ingredients_subheadings_count>0){
//             let subheadings_used = 0;
//             if(ingredients_array_splits.includes(-1)){
//                 customHtml = customHtml + `
//                   <h3>${ingredients_subheadings[subheadings_used]}</h3> ` 
//                   subheadings_used = subheadings_used + 1;
//                 }
//             customHtml = customHtml + `<ul>`
//             console.log(ingredients_array.length);
//             ingredients_array.forEach((ingredient, index) => {
//                 console.log(index);
                
//                 if (!ingredients_array_splits.includes(index)){
//                     customHtml = customHtml + `<li>${ingredient}</li>`
//                 } else if (ingredients_array_splits.includes(index)){
//                     customHtml = customHtml + `
//                     <li>${ingredient}</li>
//                     </ul>
//                     <h3>${ingredients_subheadings[subheadings_used]}</h3>
//                     <ul>
//                     `
//                     subheadings_used = subheadings_used + 1;
//                 }
//                 if (index == ingredients_array.length-1){
//                     console.log('end of array');
//                     customHtml = customHtml + `</ul>
//                     </div>`
//                 }
//             });
//         }
//         else if (ingredients_subheadings_count == 0){
//             customHtml = customHtml +  `<ul>
//                     ${ingredients_array.map(ingredient => `<li>${ingredient}</li>`).join('')}
//                 </ul>
//         </div>`
//     }
// }


    // if (directions_array){
    //     customHtml = customHtml + `
    //     <div class="directions">
    //         <h2>Directions</h2>`

    //     if (directions_subheadings_count>0){
    //         let subheadings_used = 0;
    //         if(directions_array_splits.includes(-1)){
    //             customHtml = customHtml + `
    //               <h3>${directions_subheadings[subheadings_used]}</h3> ` 
    //               subheadings_used = subheadings_used + 1;
    //             }
    //         customHtml = customHtml + `<ul>`
    //         console.log(directions_array.length);
    //         directions_array.forEach((direction, index) => {
    //             console.log(index);
                
    //             if (!directions_array_splits.includes(index)){
    //                 customHtml = customHtml + `<li>${direction}</li>`
    //             } else if (directions_array_splits.includes(index)){
    //                 customHtml = customHtml + `
    //                 <li>${direction}</li>
    //                 </ul>
    //                 <h3>${directions_subheadings[subheadings_used]}</h3>
    //                 <ul>
    //                 `
    //                 subheadings_used = subheadings_used + 1;
    //             }
    //             if (index == directions_array.length-1){
    //                 console.log('end of array');
    //                 customHtml = customHtml + `</ul>
    //                 </div>`
    //             }
    //         });
    //     }

    //     else if (directions_subheadings_count == 0){
    //         customHtml = customHtml +  `<ol>
    //                 ${directions_array.map(direction => `<li>${direction}</li>`).join('')}
    //             </ol>
    //     </div>`
    //     }


//     customHtml = customHtml + `\n
//         </div>
//     `;

//     console.log(directions_array);

// }