let formatSelection = document.getElementById('box-of-format-options');
const formatOptions = document.querySelectorAll('input[name="recipe-format"]');

mom_format_categories = `
    <option value="apps">Apps & Snacks</option>
    <option value="bread">Bread & Rolls</option>
    <option value="main-courses">Main Courses</option>
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

            console.log(format);
            newrecipeHTML=localStorage.getItem('recipe-html');
        

            try {
                const response = await fetch('/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    category: category,
                    format: format,
                    recipeHtml: newrecipeHTML
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