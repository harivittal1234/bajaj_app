const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const USER_ID = "hari_vittal_07012004";
const EMAIL = "hari@abc.com";
const ROLL_NUMBER = "BHDG4321";

app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        const numbers = data.filter(item => /^\d+$/.test(item));
        const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
        const highestLowercase = alphabets.filter(char => char === char.toLowerCase())
                                          .sort((a, b) => b.localeCompare(a))[0];

        let fileValid = false;
        let fileMimeType = null;
        let fileSizeKb = null;

        if (file_b64) {
            try {
                const fileBuffer = Buffer.from(file_b64, 'base64');
                fileValid = true;
                // This is a simple MIME type guess. For more accurate results, consider using 'file-type' npm package
                fileMimeType = file_b64.startsWith('/9j/') ? 'image/jpeg' : 
                               file_b64.startsWith('iVBORw0KGgo') ? 'image/png' : 
                               'application/octet-stream';
                fileSizeKb = (fileBuffer.length / 1024).toFixed(2);
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }

        const response = {
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
            file_valid: fileValid
        };

        if (fileValid) {
            response.file_mime_type = fileMimeType;
            response.file_size_kb = fileSizeKb;
        }

        res.json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(400).json({ is_success: false, error: error.message });
    }
});

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});