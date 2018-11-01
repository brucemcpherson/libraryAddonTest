/**
* runs on the client side
* for testing whether libraries have an effect
* @namespace Client
*/
var Client = (function (ns) {
  
  /**
  * schedule another poke
  * @param {function} func a func to pass to log
  * @return {object} stat
  */
  ns.schedule = function (func) {
    
    var stat;
    // throttle the max absolute and parallel number of requests
    if (App.globals.stop || App.globals.stats.length >= App.globals.MAX_REQUESTS) {
      
      // we're all done
      if (App.globals.log && (!inProgress_().length || App.globals.stop)) {
        ns.log(func);
      }
      
    }
    else if (inProgress_().length < App.globals.divs.parallel.value) {
      stat = {
        initiatedByClient:new Date().getTime(),
        receivedByServer:0,
        receivedByClient:0
      };
      stat.index = App.globals.stats.push (stat)-1;
    }

    return stat;
  };
  
  function inProgress_ () {
    return App.globals.stats.filter(function (d) {
      return !d.receivedByServer;
    });
  }
  /**
   * fill up the request queue initially
   */
  ns.startPoking = function () {
    
    // finish anything still running
    if (inProgress_().length) {
      App.reportMessage('aborting...');
      App.globals.stop = true;
      ns.schedule (ns.startPoking);
    };
    
    App.reportMessage('starting');
    App.globals.stop = false;
    App.globals.stats = [];
    App.globals.start = new Date().getTime();
    while (ns.provoke()) {
      
    }
  };

  /**
  * provoke a server activity and time it
  * @return {object} the provoked item
  */
  ns.provoke = function () {
    
    // kick off some pokes
    
    var stat = ns.schedule();
    if (stat) {

      google.script.run
      
      .withFailureHandler ( function (err) {
        App.reportMessage (err);
        App.stop = true;
      })
      
      /**
      * called back from server
      * will record time recevied back
      * and potentially push another
      */
      .withSuccessHandler ( function (updated) {
        // store result
        updated.receivedByClient = new Date().getTime();
        App.reportMessage('got ' + updated.index);
        App.globals.stats[updated.index]=updated;
        
        // rey to do some more
        ns.provoke();
      })
      
      .expose('Server','provoke', stat);
    }                      
    
    return stat;
  };
  
  /**
  * log results
  * @param {function} [func] something to run on completion
  */
  ns.log = function (func) {
    
    google.script.run
    
    .withFailureHandler ( function (err) {
      App.reportMessage (err);
    })
    
    
    .withSuccessHandler ( function (stats) {
      App.reportMessage ('did ' + App.globals.stats.length + ' pokes');
      if (func) { 
        func();
      }
    })
    
    .expose(
      'Server', 
      'log', 
      App.globals.stats , 
      new Date().getTime() - App.globals.start ,
      App.globals.prefix+ App.globals.divs.parallel.value
    );                    
    
  };
  
  return ns;
})(Client || {});

