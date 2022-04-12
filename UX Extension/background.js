let fields = ['date_created','src','evid','evid_desc','name','component_id','component_type', 'page_id'];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ fields });
  console.log(`Default fields are ${fields.join(',')}`);
});


