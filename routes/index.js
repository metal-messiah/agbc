var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {

    var goodreads = require('goodreads')

    var fs = require('fs');
    var readline = require('readline');
    var google = require('googleapis');
    var googleAuth = require('google-auth-library');
//var repTask = require('repeat');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
    var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
        process.env.USERPROFILE) + '/.credentials/';
    var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// Load client secrets from a local file.

    function getGetOrdinal(n) {
        var s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };


    fs.readFile('./keys/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Sheets API.
        authorize(JSON.parse(content), getData);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        console.log(credentials);
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            oauth2Client.getToken("4/wg2TQTxu1k2sf4j7SKHKeYtjMf-buRMOZzak_Kfn81c", function (err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            });
        });
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }

    /**
     * Print the names and majors of students in a sample spreadsheet:
     * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */
    function getData(auth) {
        console.log("GETTING CURRENT BOOK DATA")
        var sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
            auth: auth,
            spreadsheetId: '1d8rZFUSAOY34W6bgKlQAp4oswU-D3u1Z8gsdOcmMzLY',
            range: 'Current Book!A1:C2',
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var rows = response.values;
            if (rows.length == 0) {
                console.log('No data found.');
            } else {
                //currentBookData = [];
                for (var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    // Print columns A and E, which correspond to indices 0 and 4.
                    if (row[0] && row[1]) {
                        //console.log(row)

                        //console.log(row)

                        currentBook = {
                            book: row[0],
                            author: row[1],
                            date: row[2]
                        };


                        //console.log(obj);


                        var goodreadsKey = "GJhHhKXZ5QdcczBAwkBo1A";
                        var goodreadsSecret = "McGNCMy5fy4yaksvI4tyrAIMUHDswpSaTwvowz3XRQ";
                        var gr = new goodreads.client({'key': goodreadsKey, 'secret': goodreadsSecret});

                        var goodreadsInfo = gr.getReviewsByTitle(row[0], row[1], null, function (json) {

                            try {
                                grBook = json.GoodreadsResponse.book[0];
                            }
                            catch (err) {
                                grBook = {id: null, image_url: '/images/no_cover.jpg', url: '#'};

                            }
                            //console.log("GOODREADS CURRENT BOOK DATA")
                            //console.log(json)

                            currentBook.grID = grBook.id
                            currentBook.thumbnail = grBook.image_url[0];
                            currentBook.grURL = grBook.url[0];
                            currentBook.grDesc = grBook.description;

                            res.render('index', {title: 'AGBC', data: currentBook})
                        });

                    }
                }
            }
        });
    }


});

module.exports = router;
