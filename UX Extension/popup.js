/////// CLICK EVENT LISTENERS
// Click event for submiting choices
// submitChoices.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: fieldChoices(tab),
//     });
// });
// async function example() {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: fieldChoices(tab),
//     files: ["background.js"],
//     files: ["popup.html"],
//     files: ["popup.js"],
//   });
// }
submitChoices.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = fieldChoices(tab);
  chrome.tabs.update(tab.id, { url });
  
  
  // chrome.tabs.onUpdated.addListener(function (tab) {
  //   chrome.tabs.reload(tab.id);
    
  // });

  // chrome.tabs.query({ active: true, currentWindow: true }, function () {
  //   chrome.tabs.update(tab.id, { url });
  //   chrome.tabs.onUpdated.addListener(function () {
  //     chrome.tabs.reload();
      
  //   });
  // });

  chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    if(details.frameId === 0) {
      chrome.tabs.reload();
    }
  });
});

// Click event for saving presets (CLEAR)
savePreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: savePresetFunc(tab),
    });
})

// Applying selected preset (CLEAR)
applyPreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: applyPresetFunc(tab),
    });
});

// Delete selected preset (CLEAR)
deletePreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: deletePresetFunc(tab),
    });
});





// Populating presets dropdown (CLEAR)
let myPresets = document.getElementById('myPresets');

chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
    for (index in allKeys) {
        myPresets.options[myPresets.options.length] = new Option(allKeys[index], index);
    }
    
});

let myPresetFields = document.getElementById('presetFields');
myPresetFields.innerText = myPresets.options[0].text;

myPresets.addEventListener("change", function() {
  selectedPreset = myPresets.options[myPresets.selectedIndex].text
  chrome.storage.local.get([selectedPreset], function(result) {
    myPresetFields.innerText = result[selectedPreset];
  })
  
})



// Applying the switch values (CLEAR) Creating Url with the field choices
function fieldChoices(tab){
  var url = tab.url;
  let choices = getChoicesFromForm();
  if (choices.length > 0) {
    var newUrl = url.substring(0,url.indexOf('&fields')+8) + choices + url.substring(url.indexOf('&levels'))
    //chrome.tabs.update(tab.id, {url: newUrl});
    return newUrl; //this is new


    // chrome.tabs.getSelected(null, function(tab) {
    //   var code = 'window.location.reload();';
    //   chrome.tabs.executeScript(tab.id, {code: code});
    // });
  }
}

// Save Preset Function (CLEAR)
function savePresetFunc(tab){
  let choices = getChoicesFromForm();
  let presetName = prompt("Please enter your preset name","My Preset");
  if (presetName === null) {
    return; //break out of the function early
  }
  chrome.storage.local.set({[presetName]: choices}, function() {
    alert('Preset saved succesfully!')
    window.location.href = "popup.html";

  })
}

// Delete preset function (CLEAR)
function deletePresetFunc(tab){
  let select = document.getElementById("myPresets");
  let chosenPreset = select.options[select.selectedIndex].text;
  // chrome.storage.local.clear();
  chrome.storage.local.remove([chosenPreset], function() {
    alert('Preset removed successfully!');
    window.location.href = "popup.html";
  });
}

// Apply preset function
function applyPresetFunc(tab) {
  let select = document.getElementById("myPresets");
  let chosenPreset = select.options[select.selectedIndex].text;
  chrome.storage.local.get(chosenPreset, function(result) {
    let params = result[chosenPreset];
    var url = tab.url;
    var newUrl = url.substring(0,url.indexOf('&fields')+8) + params + url.substring(url.indexOf('&levels'))
    chrome.tabs.update(tab.id, {url: newUrl});
  })
}

// Looping through the form to get the input (CLEAR)
function getChoicesFromForm(){
  const form = document.getElementById('fieldChoices').elements;
  let choices = [];
  Array.from(form).forEach(element => {
    if (element.checked && element.type === 'checkbox'){
      choices.push(element.id.substring(0,element.id.length-6));
    }
    if (element.value !== '' && element.type === 'text')  {
      let noSpace = element.value.replace(/\s+/g, '');
      choices.push(noSpace);
    }
  });
  return choices.join();
}