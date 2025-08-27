const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const port = 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true,
    // limit: 10000,
    parameterLimit: 5
}));


app.get('/', (req,res) => {
    res.send('hello from express!');
});

app.post('/upload', function(req, res) {
    let pythonOutput = '';
    let args = ['soup.py', JSON.stringify(req.body)];
    const pythonProcess = spawn('python', args);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Node output: ${data}`);
        pythonOutput += data.toString();
    });


    pythonProcess.stderr.on('data', (data) => {
        console.error(`Node error: ${data}`);
    });

    pythonProcess.on('exit', () => {
        console.log('the python script has exited');
        
        try {
            // Parse the JSON output from Python
            const recipeData = JSON.parse(pythonOutput.trim());
            
            // Custom HTML content for the PDF
            const customHtml = `
                <body>
                    <h1>${recipeData.title}</h1>
                    <div class="color-stripe"></div>
                    <p class="servings">Serves: ${recipeData.servings}</p>
                    
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
                </body>
            `;

            (async () => {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();

                    
                    await page.setContent(customHtml, { waitUntil: 'networkidle0' });
                    await page.addStyleTag({ path: 'recipe_style.css' })

                    await page.pdf({
                        path: 'custom_document.pdf',
                        format: 'A4',
                        printBackground: true,
                        displayHeaderFooter: false,
                        margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' }
                    });

                    await browser.close();
                    console.log('PDF generated successfully!');
            })();

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
});

app.listen(port);





