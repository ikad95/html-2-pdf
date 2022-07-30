const express = require('express')
const puppeteer = require('puppeteer-core');
const asyncify = require('express-asyncify')
const bodyParser = require('body-parser')
const app = asyncify(express())

require('dotenv').config()
const PORT = process.env.PORT

app.use( bodyParser.json() );
app.use(express.json())

async function printPDF(req) {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        'headless':true
    });
    const page = await browser.newPage();
    await page.setContent(req.body.html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdf
}

app.post('/', async (req, res) => {
    //Write logic for pdf conversion here
    (async () => {
        console.log("Request In")
        printPDF(req).then(pdf => {
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
            res.send(pdf)
        })
    })();
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
