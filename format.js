const form = document.querySelector('form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const category = formData.get('recipe-category');
            const format = formData.get('recipe-format');
            
            // window.location.href = 'print.html';

            try {
                const response = await fetch('http://127.0.0.1:3000/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    category: category,
                    format: format,
                    recipeHtml: localStorage.getItem('recipe-html')
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