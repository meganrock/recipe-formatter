const form=document.getElementById('recipe-text');
const resultsSection = document.getElementById('results');
const confirmResults = document.getElementById('confirm-results')


form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    handleFormSubmit();
    return false;
});

async function handleFormSubmit() {
    const fd = new FormData(form);
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
                
        if (result.success) {
            const recipeData = JSON.parse(result.pythonOutput.trim());
            const customHtml = `
                    <body>
                        <header class="flex">
                            
                        </header>
                        <h1>${recipeData.title}</h1>        
                        <div class="flex main-recipe">
                        <span>${recipeData.servings}</span>
                            <div class="ingredients">
                                <h2>Ingredients</h2>
                                <ul>
                                    ${recipeData.ingredients.map(ingredient => `<li>• ${ingredient}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="directions">
                            <h2>Directions</h2>
                            <ol>
                                ${recipeData.directions.map(direction => `<li>${direction}</li>`).join('')}
                            </ol>
                        </div>
                        </div>
                    </body>
                `;
            resultsSection.innerHTML = "";
            confirmResults.innerHTML = "";
            resultsSection.insertAdjacentHTML('afterbegin', '<h2>Your recipe text looks like this:</h2>');
            resultsSection.insertAdjacentHTML('beforeend', customHtml);
            confirmResults.insertAdjacentHTML('afterbegin', `
                <h2>Does this look good?</h2>
                <button class="big-button yes-button" value=>Yes, take me to formatting.</button>
                <button class="big-button no-button">No, I need to edit the text.</button>
                `)
        }    

    } catch (error) {
        console.error('Error:', error);
    }
    return false;
}
