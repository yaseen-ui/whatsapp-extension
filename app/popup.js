const btn = document.getElementById('send');

btn.addEventListener('click', () => {
    const text = document.getElementById("wtName").value;
    const number = document.getElementById("contactsDD").value;
    const message = { text, number };
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message)
    })
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { tabOpen: true })
})

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    console.log("Message received in popup.js:", response);
    message = response.message.map(ele=>`+${ele.substring(0,12)}`);
    let html = '<option>Select Number(s)</option>';
    message.forEach(element => {
        html += `<option value=${element}>${element}</option>`;
    });
    document.getElementById('contactsDD').innerHTML = html;
});