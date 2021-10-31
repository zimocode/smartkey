console.log("apps.js");
chrome.runtime.sendMessage({type:"apps_back",value:sde.apps.enable},function(response){})
