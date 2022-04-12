// When the button is clicked, inject forceBolt into current page
// boltLive.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: boltLiveFunc(tab),
//     });
//   });

// tbLive.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: tbLiveFunc(tab),
//     });
//   });

// nameButton.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: nameFunc(tab),
//     });
//   });

/////// CLICK EVENT LISTENERS
// Click event for submiting choices in from the switches
submitChoices.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: fieldChoices(tab),
    });
});

// Click event for saving presets
savePreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: savePresetFunc(tab),
    });
})

// Applying selected preset
applyPreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: applyPresetFunc(tab),
    });
});

// Delete selected preset
deletePreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: deletePresetFunc(tab),
    });
});





// Populating presets dropdown
let myPresets = document.getElementById('myPresets');
chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
    for (index in allKeys) {
        myPresets.options[myPresets.options.length] = new Option(allKeys[index], index);
    }
});




// The body of this function will be executed as a content script inside the
// current page

// function boltLiveFunc(tab){
//     var customParam = encodeURI('forceBolt');
//     var url = tab.url;

//     if (url.indexOf(customParam) === -1){
//         var hashStart = (url.indexOf('#') === -1) ? url.length : url.indexOf('#');
//         var querySymbol = (url.indexOf('?') === -1) ? '?' : '&';
//         var newUrl = url.substring(0, hashStart) + querySymbol + customParam +
//                     url.substring(hashStart);

//         chrome.tabs.update(tab.id, {url: newUrl});
//     } else {
//         var newUrl = url;
//         chrome.tabs.update(tab.id, {url: newUrl});
//     }
// }


// function tbLiveFunc(tab){
//     var customParam = encodeURI('forceBolt');
//     var url = tab.url;

//     if (url.indexOf(customParam) === -1){
//         var newUrl = url;
//         chrome.tabs.update(tab.id, {url: newUrl});
//     } else {
//         if (url.indexOf(customParam+'&') === -1){
//             var newUrl = url.substring(0,url.indexOf(customParam)-1);
//             chrome.tabs.update(tab.id, {url: newUrl});
//         }
//     }
// }


// Functions for table columns
// function nameFunc(tab){
//     var customParam = encodeURI('name');
//     var url = tab.url;

//     if(url.indexOf(','+customParam) === -1 && url.indexOf('%3D'+customParam) === -1){
//         var newUrl = url.substring(0,url.indexOf('&fields')+8) + customParam + url.substring(url.indexOf('&levels'))
//         chrome.tabs.update(tab.id, {url: newUrl});
        
//         // chrome.tabs.onUpdated.addListener(
//         //   tab.id, {url: newUrl}
//         // );
//         // chrome.tabs.reload();

//         // window.addEventListener('keydown', (e) => {
//         //   console.log(e)
//         // })

        
        
//         // window.dispatchEvent(new KeyboardEvent('keydown', {
//         //   'key': 'F5'
//         // }));
//     }
// }


// Collecting the switch values
function fieldChoices(tab){
  // console.log('test');
  // const form = document.getElementById('fieldChoices');
  // Array.from(form.elements).forEach(element => {
  //   console.log(element);
  // });

  // var customParam = encodeURI('name');
  var url = tab.url;
  let choices = getChoicesFromForm();
  if (choices.length > 0) {
    var newUrl = url.substring(0,url.indexOf('&fields')+8) + choices.join(',') + url.substring(url.indexOf('&levels'))
    chrome.tabs.update(tab.id, {url: newUrl});
  }
}

// Save Preset Function
function savePresetFunc(tab){
  let choices = getChoicesFromForm();
  let presetName = prompt("Please enter your preset name","My Preset");
  chrome.storage.local.set({[presetName]: choices}, function() {
    alert('Preset saved succesfully!')
    window.location.href = "popup.html";

  })
}

// Delete preset function
function deletePresetFunc(tab){
  let select = document.getElementById("myPresets");
  let chosenPreset = select.option[select.selectedIndex].text;
  chrome.storage.local.clear();
  chrome.storage.local.remove([chosenPreset]);
  window.location.href = "popup.html";
  // chrome.storage.local.remove([chosenPreset],function(){
  //   var error = chrome.runtime.lastError;
  //      if (error) {
  //          console.error(error);
  //      }
  //  })
}

// Looping through the form to get the input
function getChoicesFromForm(){
  const form = document.getElementById('fieldChoices').elements;
  let choices = [];
  Array.from(form).forEach(element => {
    if (element.checked && element.type === 'checkbox'){
      // console.log(element.id.substring(0,element.id.length-6));
      choices.push(element.id.substring(0,element.id.length-6));
    }
    if (element.value !== '' && element.type === 'text')  {
      choices.push(element.value);
    }
  });
  return choices;
}