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
    
    let pythonOutput = '';
    let args = ['scraping.py', JSON.stringify(req.body)];
    let pythonProcess = spawn('python', args);
    let useBackup = false;

    pythonProcess.stdout.on('data', (data) => {
        // console.log(`Node output: ${data}`);
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

                    <header class="flex">
                        
                    </header>
                    <h1>${recipeData.title}</h1>
                    <span>${recipeData.servings}</span>
                    
                    <div class="flex main-recipe">
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

            (async () => {
                    const browser = await puppeteer.launch({ headless: true });
                    const page = await browser.newPage();
                    const fs = require('fs');

                    try {
                        
                        let cssFile;
                        if (req.body.format === 'sides') {
                            cssFile = 'side-by-side.css';
                        } else {
                            cssFile = 'top-bottom.css';
                        }

                        let cssContent = fs.readFileSync(cssFile, 'utf8');
                        
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
                        await browser.close();
                }
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

    pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to start Python process',
            details: error.message
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



