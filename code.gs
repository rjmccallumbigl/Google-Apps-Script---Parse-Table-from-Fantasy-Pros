/*********************************************************************************************************
*
* Instructions
* 1. Create a new Google Sheet. 
* 2. Open Google Apps Script.
* 3. At top, click Resources -> Libraries -> add this library: M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV 
     and select Version 8 (or latest version). Save.
* 4. Delete all text in the scripting window and paste all this code.
* 5. Run onOpen().
* 6. Then run parseObject() from the Code or from the spreadsheet.
* 7. Accept the permissions and after running, the spreadsheet should update.
*
*********************************************************************************************************/

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Functions')
      .addItem('Clear and Update Draft Sheet', 'parseObject')
      .addToUi();
}

/*********************************************************************************************************
*
* Scrape web content.
* 
* @return {String} Desired web page content.
*
* References
* https://www.reddit.com/r/googlesheets/comments/jyhl3g/import_data_behind_java_scripts/
* https://www.fantasypros.com/nfl/rankings/dynasty-overall.php
* https://www.kutil.org/2016/01/easy-data-scrapping-with-google-apps.html
*
*********************************************************************************************************/

function getData() {
  var url = "https://www.fantasypros.com/nfl/rankings/dynasty-overall.php";
  var fromText = 'var ecrData = ';
  var toText = ';';
  
  var content = UrlFetchApp.fetch(url).getContentText();
  var scraped = Parser
  .data(content)
  .setLog()
  .from(fromText)
  .to(toText)
  .build();
  console.log(scraped);
  return scraped;
}

/*********************************************************************************************************
*
* Print scraped web content to Google Sheet.
* 
*********************************************************************************************************/

function parseObject(){
  
  //  Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  //  Return website data, convert to Object
  var responseText = getData();
  var responseTextJSON = JSON.parse(responseText);  
  
  // Define an array of all the returned object's keys to act as the Header Row
  var keyArray = Object.keys(responseTextJSON.players[0]);
  var playerArray = [];
  playerArray.push(keyArray);
  
  //  Capture players from returned data
  for (var x = 0; x < responseTextJSON.players.length; x++){
    playerArray.push(keyArray.map(function(key){ return responseTextJSON.players[x][key]}));
  }
  
  // Select the spreadsheet range and set values  
  sheet.clear().setFrozenRows(1);
  var dataRange = sheet.getRange(1, 1, playerArray.length, playerArray[0].length).setValues(playerArray);
  
}