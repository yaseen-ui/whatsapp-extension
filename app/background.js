// let contactsList = [];
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     sendResponse({ message: 'Message sent back to content' });
//     contactsList = message;
// })

// chrome.tabs.onActivated.addListener(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.runtime.sendMessage({ message: contactsList });
//     })
// })