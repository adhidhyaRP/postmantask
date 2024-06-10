const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const folderPath = path.join(__dirname, 'files');

// Ensure the directory exists
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const currentDate = new Date();
    const fileName = `${currentDate.toISOString().replace(/:/g, '-')}.txt`;
    const filePath = path.join(folderPath, fileName);
    const fileContent = currentDate.toString();

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating file', error: err });
        }
        res.status(200).json({ message: 'File created successfully', fileName });
    });
});

// Endpoint to retrieve all text files in the folder
app.get('/files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving files', error: err });
        }
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.status(200).json({ files: textFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
