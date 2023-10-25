const btn = document.getElementById('send');

let bs64Img = '';

const imageToBlobObject = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function (event) {
      if (event.target.files.length > 0) {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            bs64Img = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    });
  }

const toggleUpload = (flag) => {
    btn.disabled = flag;
    if(flag) {
        document.getElementById('uploadLabel').classList.remove("hidden")
    } else {
        document.getElementById('uploadLabel').classList.add("hidden")
    }
}

imageToBlobObject();

btn.addEventListener('click', () => {
    const text = document.getElementById("wtName").value;
    const number = document.getElementById("contactsDD").value;
    const message = { text, number,  bs64Img};
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message)
    })
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { tabOpen: true })
})

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    console.log("Message received in popup.js:", response);
    message = response.message.map(ele => { return { label: `+${ele.substring(0, 12)}`, value: ele } });
    let html = '<option>Select Number(s)</option>';
    message.forEach(element => {
        html += `<option value=${element.value}>${element.label}</option>`;
    });
    document.getElementById('contactsDD').innerHTML = html;
});