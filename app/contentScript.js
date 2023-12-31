/**
 * 
 * @param {*} API_NAME 
 * @param {*} payLoad 
 * @param {*} method 
 */
const sendDataToAPI = (API_NAME = '', payLoad = {}, method = 'POST') => {
    fetch(API_NAME, {
        method,
        body: JSON.stringify(payLoad), // body data type must match "Content-Type" header
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON 
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            // Process the response data here 
            console.log(data); // Example: Logging the data to the console 
        })
        .catch(error => {
            // Handle any errors here 
            console.error(error); // Example: Logging the error to the console 
        });
}

const bs64ToBlob = (base64String) => {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const contentType = matches[1];
    const base64Data = matches[2];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    blob = new Blob([byteArray], { type: contentType });
    return blob;
}

chrome.runtime.onMessage.addListener((response, sender) => {
    if (response.tabOpen) {
        sendContactsList();
    } else {
        // window.InputEvent = window.Event || window.InputEvent;
        // var event = new InputEvent("input", { bubbles: true });
        // var message = response.text;
        // var textBox = document.getElementsByClassName("_3Uu1_ selectable-text")[0];
        // textBox.innerHTML = message;
        // textBox.dispatchEvent(event);
        // document.getElementsByClassName("_2xy_p epia9gcq")[0].click();
        let image;
        if (response.bs64Img) {
            image = bs64ToBlob(response.bs64Img);
        }
        const payLoad = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: response.number,
            type: image ? 'image' : "text",
            text: response.text,
            image
        }
        console.log('pela', payLoad);
        sendDataToAPI(`https://graph.facebook.com/v18.0/${response.number}/messages`, payLoad);
    }
})

const sendContactsList = () => {
    const contactsList = localStorage.getItem('7vxOyyoo8S1RUFNniNkFSQ==');
    if (contactsList) {
        try {
            const contacts = Object.keys(JSON.parse(JSON.parse(contactsList)));
            chrome.runtime.sendMessage({ message: contacts }, console.log('contacts list sent to background.js'));
        } catch (error) {
            console.log(error);
            console.log('failed to fetch contact');
        }
    }
}


window.onstorage = () => {
    console.log('storage changed');
    sendContactsList();
};

