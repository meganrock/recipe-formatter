const form=document.getElementById('recipe-text');
const resultsSection = document.getElementById('results');
   
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const urlEncoded = new URLSearchParams(fd).toString();
    console.log(urlEncoded);
    const response = await fetch('http://127.0.0.1:3000/upload', {
        method: "POST",
        body: urlEncoded,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded', 'charset':'utf-8', 
        }
    })
    const result = await response.json();
            
    if (result.success) {
        // Display the Python output
        resultsSection.innerHTML = `
            <h2>Results:</h2>
            <div class="results-content">
                <h3>Python Output:</h3>
                <pre>${result.pythonOutput}</pre>
            </div>
        `;
        
        
    }
})



            

    