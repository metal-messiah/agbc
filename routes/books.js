var express = require('express');
var router = express.Router();


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
        console.log("GETTING SHEET DATA")
        var sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
            auth: auth,
            spreadsheetId: '1d8rZFUSAOY34W6bgKlQAp4oswU-D3u1Z8gsdOcmMzLY',
            range: 'Website!A2:H1000',
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var rows = response.values;
            if (rows.length == 0) {
                console.log('No data found.');
            } else {
                bookData = [];
                for (var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    // Print columns A and E, which correspond to indices 0 and 4.
                    if (row[0] && row[1]) {
                        //console.log(row)

                        if (row[6] == "#DIV/0!") {
                            row[6] = 0
                        }
                        if (row[7] == "#DIV/0!") {
                            row[7] = 0
                        }
                        //console.log(row)
                        var obj = {
                            id: row[0],
                            book: row[1],
                            type: row[2],
                            author: row[3],
                            date: row[4],
                            chosen: row[5],
                            average: row[6],
                            median: row[7],
                            grID: null,
                            thumbnail: '/images/no_cover.jpg',
                            grURL: "#"
                        };
                        //console.log(obj);

                        bookData.push(obj);


                        var goodreadsKey = "GJhHhKXZ5QdcczBAwkBo1A";
                        var goodreadsSecret = "McGNCMy5fy4yaksvI4tyrAIMUHDswpSaTwvowz3XRQ";
                        var gr = new goodreads.client({'key': goodreadsKey, 'secret': goodreadsSecret});

                        var goodreadsInfo = gr.getReviewsByTitle(row[1], row[3], (row[0] - 1), function (json) {
                            var grBook, inputID;
                            try {
                                grBook = json.GoodreadsResponse.book[0];
                                inputID = json.inputID
                            }
                            catch (err) {
                                grBook = {id: null, image_url: '/images/no_cover.jpg', url: '#'};
                                inputID = null
                            }
                            //console.log(json)
                            //console.log(json)
                            if (inputID) {

                                bookData[inputID].grID = grBook.id;
                                bookData[inputID].thumbnail = grBook.image_url[0];
                                bookData[inputID].grURL = grBook.url[0];
                            }


                        });


                    }
                }
                setTimeout(function () {
                    res.render('books', {title: 'AGBC', data: bookData})
                }, 2000)
            }
        });
    }


});
/* GET home page. */


module.exports = router;


