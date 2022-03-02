// When the button is clicked, inject forceBolt into current page
boltLive.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: boltLiveFunc(tab),
    });
  });

tbLive.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: tbLiveFunc(tab),
    });
  });

nameButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: nameFunc(tab),
    });
  });

// The body of this function will be executed as a content script inside the
// current page

function boltLiveFunc(tab){
    var customParam = encodeURI('forceBolt');
    var url = tab.url;

    if (url.indexOf(customParam) === -1){
        var hashStart = (url.indexOf('#') === -1) ? url.length : url.indexOf('#');
        var querySymbol = (url.indexOf('?') === -1) ? '?' : '&';
        var newUrl = url.substring(0, hashStart) + querySymbol + customParam +
                    url.substring(hashStart);

        chrome.tabs.update(tab.id, {url: newUrl});
    } else {
        var newUrl = url;
        chrome.tabs.update(tab.id, {url: newUrl});
    }
}


function tbLiveFunc(tab){
    var customParam = encodeURI('forceBolt');
    var url = tab.url;

    if (url.indexOf(customParam) === -1){
        var newUrl = url;
        chrome.tabs.update(tab.id, {url: newUrl});
    } else {
        if (url.indexOf(customParam+'&') === -1){
            var newUrl = url.substring(0,url.indexOf(customParam)-1);
            chrome.tabs.update(tab.id, {url: newUrl});
        }
    }
}


// Functions for table columns
function nameFunc(tab){
    var customParam = encodeURI('name');
    var url = tab.url;

    if(url.indexOf(','+customParam) === -1 && url.indexOf('%3D'+customParam) === -1){
        var newUrl = url.substring(0,url.indexOf('&fields')+8) + customParam + url.substring(url.indexOf('&levels'))
        chrome.tabs.update(tab.id, {url: newUrl});
        window.addEventListener('keydown', (e) => {
          console.log(e)
        })
        
        window.dispatchEvent(new KeyboardEvent('keydown', {
          'key': '116'
        }));
    }
}