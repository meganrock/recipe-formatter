const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const path = require('path');
const port = process.env.PORT || 3000;;


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
            const browser = await puppeteer.launch({ 
                headless: true,
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            const fs = require('fs');

            let cssFile;
            if (req.body.format === 'sidebysideserif') {
                cssFile = 'recipe_template_css/side-by-side-serif.css';
            } else if (req.body.format === 'sidebysidesans') {
                cssFile = 'recipe_template_css/side-by-side-sans.css';
            } else if (req.body.format === 'moms') {
                cssFile = 'recipe_template_css/moms-format.css';
            } else if (req.body.format === 'blue') {
                cssFile = 'recipe_template_css/blue.css';
            } else if (req.body.format === 'topbottomsans') {
                cssFile = 'recipe_template_css/top-and-bottom-sans.css';
            } else if (req.body.format === 'topbottomserif') {
                cssFile = 'recipe_template_css/top-and-bottom-serif.css';
            }




            let cssContent = fs.readFileSync(cssFile, 'utf8');
            let customHtml = req.body.recipeHtml;
            await page.setContent(customHtml, { waitUntil: 'networkidle0' });
            await page.addStyleTag({ content: cssContent });
            await page.waitForSelector('img.category-image');


            // Calculate Letter format dimensions (8.5" x 11") at 96 DPI
            const pdfWidth = 8.5 * 96; // 816px
            const pdfHeight = 11 * 96;  // 1056px

            // Set viewport to match PDF dimensions
            await page.setViewport({
                width: pdfWidth,
                height: pdfHeight
            });

            // Set print media type
            await page.emulateMediaType('print');

            // Take screenshot with exact PDF dimensions
            await page.screenshot({
                path: 'pdf_preview.png',
                fullPage: false, // Don't use fullPage - use viewport dimensions
                clip: {
                    x: 0,
                    y: 0,
                    width: pdfWidth,
                    height: pdfHeight
                }
            });

            await page.pdf({
                path: 'custom_document.pdf',
                format: 'Letter',
                printBackground: true,
                displayHeaderFooter: false,
                margin:  {
                    
                },
            });

            await browser.close();
            console.log('PDF generated successfully!');
            res.json({
                success: true
            });

    } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
    }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



