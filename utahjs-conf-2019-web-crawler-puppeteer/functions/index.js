const functions = require('firebase-functions');
const admin = require("firebase-admin");
const puppeteer = require('puppeteer');

// Setup Firebase Admin.
// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccount.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://utahjs-conf-2019-ff5b7.firebaseio.com'
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
let firestore = admin.firestore();

const utahJsConfBaseUrl = 'https://conf.utahjs.com';
const utahJsConfSpeakerUrl = `${utahJsConfBaseUrl}/speakers`;
const utahJsConfScheduleUrl = `${utahJsConfBaseUrl}/schedule`;
const headless = false; // for debugging.

// Firebase Function settings.
const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '2GB'
};

// Cron Job Schedule - How Often to trigger the function.
const schedule = '0 9 * * *'; // Everyday at 9am server time.

exports.utahJsConfWebCrawler = functions.runWith(runtimeOpts).pubsub.schedule(schedule).onRun(async () => {
// exports.utahJsConfWebCrawler = functions.https.onRequest(async () => { // for debugging. Run firebase emulators:start --only functions
    console.log('UtahJs Conf 2019 Web Crawler Started using Puppeteer!');

    const browser = await puppeteer.launch({
        headless: headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1440,
        height: 720,
    });

    // Fetch Speaker Information form /speakers
    await page.goto(utahJsConfSpeakerUrl, {
        waitUntil: 'networkidle0' // 'networkidle0' is very useful for SPAs.
    });
    
    let speakerList = await page.evaluate(async () => {
        const listItems = document.querySelectorAll('.sz-speaker--full');
        const list = [];

        for(let i = 0; i < listItems.length; i++) {
            const speaker = listItems[i];

            const photo = speaker.querySelector('div img').src
            const name = speaker.querySelector('.sz-speaker__name').innerHTML;
            const tagline = speaker.querySelector('.sz-speaker__tagline').innerHTML;
            const bio = speaker.querySelector('.sz-speaker__bio').innerHTML;
            const presentationTitle = speaker.querySelector('.sz-speaker__sessions li a').innerHTML;
            const presentationLinkElement = speaker.querySelector('.sz-speaker__sessions li a');

            presentationLinkElement.click();

            // Helper Function.
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            };

            await sleep(2500);

            const presentationDescription = document.querySelector('.sz-session__description').innerHTML;

            const speakerResult = {
                photo,
                name,
                tagline,
                bio,
                presentation: {
                    title: presentationTitle,
                    description: presentationDescription               
                }
            };

            list.push(speakerResult);
        }

        return list;
    });

    // Fetch Schedule Information form /schedule
    await page.goto(utahJsConfScheduleUrl, {
        waitUntil: 'networkidle0' // 'networkidle0' is very useful for SPAs.
    });

    speakerList = await page.evaluate((speakerList) => {
        const tracks = document.querySelectorAll('.sz-track');

        for(let track of tracks) {
            const theater = track.querySelector('.sz-track__title').innerHTML;
            const scheduleGridItems = track.querySelectorAll('.sz-session--grid');

            for(let gridItem of scheduleGridItems) {
                const card = gridItem.querySelector('.sz-session__card');
                const title = card.querySelector('a').innerHTML;
    
                let existingSpeaker = speakerList.find((s) => {
                    return s.presentation.title === title;
                });
    
                if(existingSpeaker) {
                    const time = card.querySelector('.sz-session__time').innerHTML;
                    const timeSplit = time.split(' — ');
                    const startTime = timeSplit[0];
                    const length = timeSplit[1];
                    existingSpeaker.presentation.time = startTime;
                    existingSpeaker.presentation.length = length;
                    existingSpeaker.presentation.theater = theater;
                }
            }
        }

        return speakerList;
    }, speakerList);

    // Add or Update all speakers inside Firestore. Firestore is a NoSQL style database with collections of documents.
    for(let i = 0; i < speakerList.length; i++) {
        const speaker = speakerList[i];

        const snapshot = await firestore.collection('speakers').where('name', '==', speaker.name).get();

        if(snapshot.docs.length > 0) {
            // Update.
            const doc = snapshot.docs[0].ref;

            doc.set(speaker, { merge: true });
        }
        else {
            // Add.
            await firestore.collection('speakers').add(speaker);
        }
    }
});

// For debugging.
// exports.utahJsConfWebCrawler();

exports.testFunction = functions.https.onRequest((req, res) => {
    res.send('Hello, Utah.js!');
});