///////////////////// TOOL OPTIONS
////////// SUBMITTING SELECTED FIELDS
// Event for submitting choices
submitChoices.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reloadTab(),
    });
});

// Event for applying chosen fields to the URL
submitChoices.addEventListener("mouseover", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  var url = tab.url;
  let choices = getChoicesFromForm();
  if (choices.length > 0) {
    var newUrl = url.substring(0,url.indexOf('&fields')+8) + choices + url.substring(url.indexOf('&levels'))
    chrome.tabs.update(tab.id, {url: newUrl});
  }
})

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



////////// SAVING PRESET
// Event for creating new preset
savePreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: savePresetFunc(),
    });
})

// Save Preset Function
function savePresetFunc(){
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


////////// APPLYING SAVED PRESET
// Event for applying chosen preset
applyPreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reloadTab(),
    });
});

// Event for applying preset fields to the URL
applyPreset.addEventListener("mouseover", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let select = document.getElementById("myPresets");
  let chosenPreset = select.options[select.selectedIndex].text;
  chrome.storage.local.get(chosenPreset, function(result) {
    let params = result[chosenPreset];
    var url = tab.url;
    var newUrl = url.substring(0,url.indexOf('&fields')+8) + params + url.substring(url.indexOf('&levels'))
    chrome.tabs.update(tab.id, {url: newUrl});
  })
  
})


////////// DELETE SAVED PRESET
// Event for deleting preset
deletePreset.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: deletePresetFunc(tab),
    });
});

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





////////// Populating presets dropdown
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


////////// Tab reload function
function reloadTab() {
  chrome.tabs.reload();
}




