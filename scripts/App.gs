var App = (function (ns) {
 
  // static for use on both client and server
  ns.globals = {
    stats:[],
    MAX_REQUESTS:100,
    log:true,
    stop:false,
    start:0,
    prefix:'addon-library-parallel-'
  };
  
  // for use on client side.
  ns.init = function () {
    ns.globals.divs = {
      message:document.getElementById('message'),
      parallel:document.getElementById('parallel'),
      test:document.getElementById('test')
    };
    
    ns.listeners();

  };
  
  /**
  * report a message
  * @param {string} message the message
  */
  ns.reportMessage = function (message) {
    ns.globals.divs.message.innerHTML = message;
  };
  
  /** 
   * add listeners
   */
  ns.listeners = function () {
    
    ns.globals.divs.parallel.addEventListener (
      "change", function (e) {
        Client.startPoking();
      },false);
    
    ns.globals.divs.test.addEventListener (
      "click", function (e) {
        Client.startPoking();
      },false);
    
  };
  
  return ns;
  
}) (App || {});