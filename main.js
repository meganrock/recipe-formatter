const form=document.getElementById('recipe-text');
const resultsSection = document.getElementById('results');
const confirmResults = document.getElementById('confirm-results')

function getRadioValue() {
  const selectedRadio = document.querySelector('input[name="recipe-input"]:checked');
  if (selectedRadio) {
    const radioValue = selectedRadio.value;
    urlInput = document.getElementById('url-input');
    textInput = document.getElementById('text-input-area');
    if (radioValue == "url"){
        urlInput.style.display = 'block';
        textInput.style.display = 'none';
    } else if (radioValue == "text"){
        urlInput.style.display = 'none';
        textInput.style.display = 'flex';
    }
    }
    return selectedRadio.value;
}

form.addEventListener('change', getRadioValue);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (getRadioValue()=="url"){
        if (!document.getElementById('url-input').value){
            alert('Input field is empty!')
        }
        else if (document.getElementById('url-input').value){
            resultsSection.innerHTML='';
            confirmResults.innerHTML='';
            if (document.getElementById("loader-and-message")){
                document.getElementById("loader-and-message").remove();
            }
            addLoading('main', 'Reading the recipe...');
            handleFormSubmit();
        }
    }else if(getRadioValue()=="text"){
        if (!document.getElementById('text-input').value){
            alert('Input field is empty!')
        }
        else if (document.getElementById('text-input').value){
            resultsSection.innerHTML='';
            confirmResults.innerHTML='';
            if (document.getElementById("loader-and-message")){
                document.getElementById("loader-and-message").remove();
            }
            addLoading('main', 'Reading the recipe...');
            handleFormSubmit();
        }
    }
        
    return false;
})




async function handleFormSubmit() {
    const fd = new FormData(form);

    // Handle checkbox array properly
    const checkboxes = document.querySelectorAll('input[name="recipe-info[]"]:checked');
    const selectedInfo = Array.from(checkboxes).map(cb => cb.value);
    fd.delete('recipe-info[]'); // Remove the default handling
    fd.append('recipe-info', JSON.stringify(selectedInfo));

    // Get the correct recipe value based on input method
    const inputMethod = document.querySelector('input[name="recipe-input"]:checked').value;
    let recipeValue = '';

    if (inputMethod === 'url') {
        recipeValue = document.getElementById('url-input').value;
    } else if (inputMethod === 'text') {
        recipeValue = document.getElementById('text-input').value;
    }

    // Remove the existing recipe fields and add the correct one
    fd.delete('recipe-url');
    fd.delete('recipe-text');
    fd.append('recipe', recipeValue);
    console.log(recipeValue);

    const urlEncoded = new URLSearchParams(fd).toString();
    try {
        const response = await fetch('http://127.0.0.1:3000/upload', {
            method: "POST",
            body: urlEncoded,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded', 
                'charset':'utf-8', 
            }
        })
        const result = await response.json();
        if (result === ""){
            alert('Input is empty');
            return false;
        }
        if (result.success) {
            const recipeData = JSON.parse(result.pythonOutput.trim());
            console.log('selected info' + JSON.stringify(selectedInfo));
            console.log(recipeData);
            // creating custom HTML based on checked inputs
            let customHtml = createCustomHTML(selectedInfo, recipeData, false);

            
            resultsSection.innerHTML = "";
            confirmResults.innerHTML = "";
            document.getElementById("loader-and-message").remove();
            resultsSection.insertAdjacentHTML('afterbegin', '<h2>Your recipe text looks like this:</h2>');
            resultsSection.insertAdjacentHTML('beforeend', customHtml);
            localStorage.setItem('recipe-html', customHtml);
            confirmResults.insertAdjacentHTML('afterbegin', `
                <h2>Does this look good?</h2>
                <div class="flex-column">
                    <a href="format.html"><button class="big-button yes-button" id="no-edit-button">Yes, take me to formatting.</button></a>
                    <a href="edit.html"><button class="big-button no-button" id="need-edit-button">No, I need to edit the text.</button></a>
                </div>
                `)
            let editButton = document.getElementById('need-edit-button');
            editButton.addEventListener('click', function(){
                localStorage.setItem('recipe-html', customHtml)
            })

        }
        
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("loader-and-message").remove();
        alert(`Sorry, our site can't process this recipe.`)
    }
    return false;
}





// Custom HTML content for the PDF
            // const customHtml = `
            //     <body>
            //         <header class="flex">  
            //         </header>
            //         <h1>${recipeData.title}</h1>
            //         <span>${recipeData.servings}</span>          
            //         <div class="flex main-recipe">
            //             <div class="ingredients">
            //                 <h2>Ingredients</h2>
            //                 <ul>
            //                     ${recipeData.ingredients.map(ingredient => `<li>• ${ingredient}</li>`).join('')}
            //                 </ul>
            //             </div>
            //             <div class="directions">
            //             <h2>Directions</h2>
            //             <ol>
            //                 ${recipeData.directions.map(direction => `<li>${direction}</li>`).join('')}
            //             </ol>
                        
            //         </div>
            //         </div>
            //     </body>
            // `;

            
            // const customHtml = `
            //         <body>
            //             <header class="flex">
                            
            //             </header>
            //             <div class=results-box>
            //                 <h1>${recipeData.title}</h1>        
            //                 <div class="flex main-recipe">
            //                 <span>${recipeData.servings}</span>
            //                     <div class="ingredients">
            //                         <h2>Ingredients</h2>
            //                         <ul>
            //                             ${recipeData.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            //                         </ul>
            //                     </div>
            //                     <div class="directions">
            //                     <h2>Directions</h2>
            //                     <ol>
            //                         ${recipeData.directions.map(direction => `<li>${direction}</li>`).join('')}
            //                     </ol>
            //                     <h3>${recipeData.author} </h3>
            //             </div>
            //             </div>
            //             </div>
            //         </body>
            //     `;

