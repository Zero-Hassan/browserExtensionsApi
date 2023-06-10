import FLAGS from "../constants/ACTIONS";
import OnDoDoOn from "../helpers/ON_DO_ON";


const ERROR_MESSAGES = {
    SENDING_MESSAGE: 'SENDING MESSAGE',
    UNKNOWN_ACTION: 'UNKNOWN ACTION',
    INTERNAL_ERROR: 'INTERNAL ERROR'
}



export function sendMessage(message) {
    chrome.runtime.sendMessage(message, (response) => {
        if (!chrome.runtime.lastError) {
            console.log(`${response}`);
        } else {
            console.log(`Error: ${response}`);
        }
    });
}

export function onMessage(action) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (typeof action === 'function') action(message, sender, sendResponse);
    });
}

export function onMessagePromise() {
    return new Promise((resolve) => {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            resolve(message, sendResponse);
        })
    })
}

export function Send(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            const { error } = message;
            if (error) return reject({ error, message: ERROR_MESSAGES.INTERNAL_ERROR });
            if (!chrome.runtime.lastError) {
                return resolve(response);
            } else {
                return reject({ errorMessage: chrome.runtime.lastError.message, error: ERROR_MESSAGES.SENDING_MESSAGE, message });
            }
        });
    })
}

export function extentionId() {
    return chrome.runtime.id;
}

export function Messenger(informer) {
    const ACTIONS = {};
    const ACCEPTED_MESSAGES = [];

    const ondo_doon = OnDoDoOn(informer, ACTIONS);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { type } = message;
        if (ondo_doon.getDoOn(type) && ondo_doon.getDoOn(type).action_name === FLAGS.MESSENGER.RESPOND) {
            informer.notify(type, { type, message, sender, sendResponse });
        }
        else {
            if (ACCEPTED_MESSAGES.indexOf(type) >= 0) {
                informer.notify(type, { ...message });
                sendResponse({ type, received: true });
            } else {
                sendResponse({ type, error: 'UNKOWN ACTION' })
            }
        }

    });
    ACTIONS[FLAGS.MESSENGER.RESPOND] = ({ type, response, sendResponse }) => {
        if (sendResponse) sendResponse({ type, response });
    }
    ACTIONS[FLAGS.MESSENGER.SEND_MESSAGE] = (message) => {
        console.log({message});
        Send(message)
            .then(response => informer.notify(FLAGS.MESSENGER.MESSAGE_REACHED, { response }))
            .catch(error => informer.notify(FLAGS.MESSENGER.MESSAGE_DID_NOT_REACHED, { error }))
    }
    ACTIONS[FLAGS.MESSENGER.FILTER_MESSAGE] = (message) => {
        const { action } = message;
        informer.notify(action, message);
    }
    return {
        ...ondo_doon,
        accept: function (types) {
            ACCEPTED_MESSAGES.push(...types);
            return this;
        }
    };
}