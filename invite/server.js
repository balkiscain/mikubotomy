const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 10000;

// Helper function to count responses
function countResponses(responses) {
    const accepted = responses.filter(r => r.response === 'accepted').length;
    const denied = responses.filter(r => r.response === 'denied').length;
    return {
        accepted,
        denied,
        total: responses.length
    };
}

// Helper function to format date
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
}

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
const responsesFile = path.join(dataDir, 'responses.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(responsesFile)) {
    fs.writeJsonSync(responsesFile, []);
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Set up Handlebars
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
        countResponses: function(responses) {
            return countResponses(responses);
        },
        formatDate: function(date, format) {
            return formatDate(date, format);
        },
        eq: function(a, b) {
            return a === b;
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'templates'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/respond', (req, res) => {
    const { name = 'Guest', response } = req.body;
    
    if (response === 'accepted' || response === 'denied') {
        try {
            const responses = fs.existsSync(responsesFile) 
                ? fs.readJsonSync(responsesFile) 
                : [];
                
            responses.push({
                timestamp: new Date().toISOString(),
                name: (name || '').trim() || 'Guest',
                response
            });
            
            fs.writeJsonSync(responsesFile, responses, { spaces: 2 });
            return res.redirect(`/response?choice=${response}&name=${encodeURIComponent(name)}`);
        } catch (error) {
            console.error('Error saving response:', error);
            return res.status(500).send('Error saving your response');
        }
    }
    
    res.redirect('/');
});

app.get('/response', (req, res) => {
    const { choice, name = 'Guest' } = req.query;
    
    if (choice !== 'accepted' && choice !== 'denied') {
        return res.redirect('/');
    }
    
    res.render('response', { 
        choice, 
        name: name || 'Guest',
        layout: false
    });
});

app.get('/summary', (req, res) => {
    try {
        const responses = fs.existsSync(responsesFile) 
            ? fs.readJsonSync(responsesFile)
            : [];
            
        res.render('summary', { 
            responses,
            now: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error loading responses:', error);
        res.status(500).send('Error loading guest list');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
