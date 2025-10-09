const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '')));

// Serve static files from the src directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// API endpoint to get the current count
app.get('/api/counter', (req, res) => {
  fs.readFile('counter.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading counter');
    }
    res.json(JSON.parse(data));
  });
});

// API endpoint to increment the count
app.post('/api/counter', (req, res) => {
  fs.readFile('counter.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading counter');
    }
    const counter = JSON.parse(data);
    counter.count++;
    fs.writeFile('counter.json', JSON.stringify(counter), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing counter');
      }
      res.json(counter);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
