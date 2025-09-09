const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const path = require('path');
const port = 3000;


const app = express();

app.use(express.static('.'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 5
}));

app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', function(req, res) {
    console.log('Upload endpoint hit with data:', req.body);
    
    // Parse the recipe-info checkboxes
    if (req.body['recipe-info']) {
        try {
            req.body.recipeInfo = JSON.parse(req.body['recipe-info']);
        } catch (e) {
            req.body.recipeInfo = [];
        }
    }

    // The radio button value is already available as req.body['recipe-input']
    console.log('Selected recipe info:', req.body.recipeInfo);
    console.log('Input method:', req.body['recipe-input']);



    let pythonOutput = '';
    let args = ['scraping.py', JSON.stringify({
        ...req.body,
        recipeInfo: req.body.recipeInfo || [],
        inputMethod: req.body['recipe-input'],
    })];
    let pythonProcess = spawn('python', args, {
        encoding: 'utf8'
    });


    pythonProcess.stdout.on('data', (data) => {
        // console.log(`Node output: ${data}`);
        pythonOutput += data.toString();
    });


    pythonProcess.stderr.on('data', (data) => {
        console.error(`Node error: ${data}`);
    });

    pythonProcess.on('exit', () => {
        console.log('req.body.recipeInfo:', req.body.recipeInfo);
        console.log('the python script has exited');
        
        try {
        // Parse the JSON output from Python
        if (!pythonOutput.trim()) {
                throw new Error('Empty output from Python script');
            }
            const recipeData = JSON.parse(pythonOutput.trim());
            let customHtml = `
            <body>
            `

            // creating custom HTML based on checked inputs
            if (req.body.recipeInfo.includes('title')){
                customHtml = customHtml + `\n<h1>${recipeData.title}</h1>`;
            }

            if (req.body.recipeInfo.includes('servings')){
                customHtml = customHtml + `\n<span>${recipeData.servings}</span>`;
            }

            if (req.body.recipeInfo.includes('author')){
                customHtml = customHtml + `\n<span>Recipe by: ${recipeData.author}</span>`;
            }

            if (req.body.recipeInfo.includes('link')){
                customHtml = customHtml + `\n<span><a href=${recipeData.link}>See More</a></span>`;
            }

            if (req.body.recipeInfo.includes('prep-time')){
                customHtml = customHtml + `\n<span>Prep Time: ${recipeData.prep_time}</span>`;
            }

            if (req.body.recipeInfo.includes('cook-time')){
                customHtml = customHtml + `\n<span>Cook Time: ${recipeData.cook_time}</span>`;
            }

            if (req.body.recipeInfo.includes('total-time')){
                customHtml = customHtml + `\n<span>Total Time: ${recipeData.total_time}</span>`;
            }

            if (req.body.recipeInfo.includes('ingredients')){
                customHtml = customHtml + `
                <div class="ingredients">
                    <h2>Ingredients</h2>
                        <ul>
                            ${recipeData.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                </div>`
            }

            if (req.body.recipeInfo.includes('directions')){
                customHtml = customHtml + `
                <div class="ingredients">
                    <h2>Directions</h2>
                        <ol>
                            ${recipeData.directions.map(direction => `<li>${direction}</li>`).join('')}
                        </ol>
                </div>`
            }
            customHtml = customHtml + '\n</body>';

            // customHtml = localStorage.getItem('recipe-html');

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

            
            res.json({
                success: true,
                message: 'Data processed successfully',
                data: req.body,
                pythonOutput: pythonOutput.trim()
            });
        } catch (error) {
        console.error('Error parsing Python output:', error);
        res.json({ success: false, error: 'Failed to parse recipe data' });
    }
    });

    pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to start Python process',
            details: error.message
        });
    });
});



app.post('/generate-pdf', async function(req, res) {
    console.log('PDF generation endpoint hit with data:', req.body);
    
    try{
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            const fs = require('fs');

            let cssFile;
            if (req.body.format === 'sidebyside') {
                cssFile = 'side-by-side.css';
            // } else if (req.body.format === 'sides') {
            //     cssFile = 'top-bottom.css';
            } else if (req.body.format === 'moms') {
                cssFile = 'moms-format.css';
            }

            let cssContent = fs.readFileSync(cssFile, 'utf8');
            let customHtml = req.body.recipeHtml;
            await page.setContent(customHtml, { waitUntil: 'networkidle0' });
            await page.addStyleTag({ content: cssContent });

            await page.pdf({
                path: 'custom_document.pdf',
                format: 'Letter',
                printBackground: true,
                displayHeaderFooter: false,
                
            });

            await browser.close();
            console.log('PDF generated successfully!');
    } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
    }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



