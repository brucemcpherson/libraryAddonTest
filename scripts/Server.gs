
function expose (namespace , method) {
   return this[namespace][method]
  .apply(this,Array.prototype.slice.call(arguments,2));
}

/**
 * runs on the server side
 * for testing whether libraries have an effect
 * @namespace Server
 */
var Server = (function (ns) {

  /**
   * doesnt do anything except provoke a script load 
   * and return some stats
   * @param {object} stats stats object
   * return {object} stats updated stats object
   */
  ns.provoke = function (stats) {
    stats.receivedByServer = new Date().getTime();
    return stats;
  };
  
  /**
   * writes the stats to a sheet
   * @param {[object]} the stats
   * @param {number} elapsed pverall elapsed time
   * @param {string} where to write the sheet name
   * @return {void}
   */
  ns.log = function (stats,elapsed, sheetName) {
    
    //where to write the data
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // create the sheet if necessary
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    var fiddleRange =  sheet.getDataRange();
    
    // get a fiddle and set the data
    var fiddler = new cUseful.Fiddler()
    .setData (stats);
    
    // clear and write the result
    fiddleRange
    .getSheet()
    .clearContents();
 
    fiddler
    .getRange(fiddleRange)
    .setValues(fiddler.createValues());
    
    // analyze the results on a new sheet
    var sheet = ss.getSheetByName('summary') || ss.insertSheet('summary');
    
    fiddler
    .setValues(sheet.getDataRange().getValues())
    .getData().push ( {
      "name":sheetName,
      "start to finish":stats.reduce(function(p,c) {
        return p+c.receivedByClient-c.initiatedByClient;
      },0)/stats.length,
      elapsed:elapsed
    });
  
    fiddler.setData(fiddler.getData());
    
  
    var fiddleRange =  sheet.getDataRange();

    // clear and write the result
    fiddleRange
    .getSheet()
    .clearContents();
 
    fiddler
    .getRange(fiddleRange)
    .setValues(fiddler.createValues());
    
    return stats;
  };
  
  return ns;
  
}) (Server || {});
