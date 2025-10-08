let formatSelection = document.getElementById('box-of-format-options');
const formatOptions = document.querySelectorAll('input[name="recipe-format"]');

mom_format_categories = `
    <option value="none">None</option>
    <option value="apps">Apps & Snacks</option>
    <option value="beverages">Beverages & Blends</option>
    <option value="bread">Bread & Rolls</option>
    <option value="soup-sammies">Soup & Sammies</option>
    <option value="salads">Salads & Dressings</option>
    <option value="main-courses">Main Courses</option>
    <option value="sauces-sides">Sauces & Sides</option>
    <option value="pasta-grains">Pasta & Grains</option>
    <option value="mixes-marinades">Mixes & Marinades</option>
    <option value="red-meat">Beef & Red Meats</option>
    <option value="poultry-pork">Poultry & Pork</option>
    <option value="fish">Fish & Seafood</option>
    <option value="sweets">Sweets & Treats</option>
    <option value="cakes-pies">Cakes & Pies</option>
    <option value="cookies">Cookies & Bars</option>
    <option value="breakfast">Breakfast & Brunch</option>
    <option value="air-fryer">Air Fryer</option>
    <option value="slow-cooker">Slow Cooker</option>
    <option value="instant-pot">Instant Pot</option>
    <option value="seasonal">Seasonal & Holiday</option>
`

formatOptions.forEach(option => {
    option.addEventListener('change', function() {
      if (this.checked) {
        selectedFormat = this.value
      }
      if (selectedFormat == 'moms'){
        document.getElementById("recipe-category").innerHTML="";
        document.getElementById("recipe-category").insertAdjacentHTML('beforeend', mom_format_categories);
      }
      else{
        document.getElementById("recipe-category").innerHTML="";
        document.getElementById("recipe-category").insertAdjacentHTML('beforeend', `<option value="none">None</option>`);
      }
    });
});





// form submission

const form = document.querySelector('form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            addLoading('#cookbook-section-dropdown', 'Preparing the PDF...')
            const formData = new FormData(form);
            const format = formData.get('recipe-format');
            const category = formData.get('recipe-category');



            try {
                const response = await fetch('http://127.0.0.1:3000/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    category: category,
                    format: format,
                    recipeHtml: addCategory(category)
                    // recipeHtml: localStorage.getItem('recipe-html')
                })
                });
                const result = await response.json();
                if (result.success) {
                    console.log('PDF generated successfully!');
                    window.location.href = 'print.html'
                    
                } else {
                    alert('Error generating PDF: ' + result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error generating PDF');
            }
        });