import FLAGS from "../constants/ACTIONS";
import { _FLAGS } from "../constants/FLAGS";
import OnDoDoOn from "../helpers/ON_DO_ON";


export function onTabActivted(callBack) {
    chrome.tabs.onActivated.addListener(tab => {
        if (typeof callBack !== 'function') return;
        activeTab().then(callBack);
    });
}

export function onTabRemoved(callBack) {
    chrome.tabs.onRemoved.addListener((tabId) => {
        if (typeof callBack === 'function') return callBack(tabId);
    });
}

export function sendMessageToTab(id, message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(id, message, function (response) {
            if (!chrome.runtime.lastError) {
                resolve(response)
            } else {
                reject({ error: chrome.runtime.lastError, response, message });
            }
        });
    })
}


export function onTabUpdated(callBack) {
    chrome.tabs.onUpdated.addListener(
        (id, changeInfo, tab) => {
            callBack({ id, changeInfo, tab })
        }
    )

}

export function createTab(options) {
    return new Promise(resolve => {
        chrome.tabs.create(options, resolve);
    })
}

export function activeTab() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs[0])
        });
    })
}
export function excuteOnCaseActiveTab(id, callBack) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0] && tabs[0].id === id) callBack(tabs);
    });
}

export function currenTab() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs[0]);
        });
    })
}


export function Tab(informer) {
    const ACTIONS = {};


    onTabActivted(tab => {
        informer.notify(FLAGS.TAB.SELECTED, { tab });
    });
    onTabUpdated(({ id, changeInfo, tab }) => {
        if (changeInfo.status === 'complete') {
            excuteOnCaseActiveTab(id, (tabs) => {
                setTimeout(() => {
                    informer.notify(FLAGS.TAB.UPDATED, { id, changeInfo, tab, tabs });
                }, 1000);
            });
        }

    });

    ACTIONS[FLAGS.TAB.VERIFY_JS] = ({ tab }) => {
        sendMessageToTab(tab.id, { type: FLAGS.TAB.JS_IS_INJECTED })
            .then(response => {
                informer.notify(FLAGS.TAB.JS_ALREADY_INJECTED, { tab, response });
            }).catch(error => {
                informer.notify(FLAGS.TAB.JS_NOT_INJECTED_YET, { tab, error })
            })
    },
        ACTIONS[FLAGS.TAB.SEND_MESSAGE] = (message) => {
            const { type, tab } = message;
            sendMessageToTab(tab.id, message)
                .then(response => {
                    console.log("reached", response);
                    informer.notify(FLAGS.TAB.MESSAGE_REACHED, { type, response });
                }).catch(error => {
                    console.log("error", error);
                    informer.notify(FLAGS.TAB.MESSAGE_DID_NOT_REACHED, { type, error })
                })
        }
    ACTIONS[FLAGS.TAB.OPEN_WEB_APP] = (data) => {
        const { url, json } = data;
        createTab({ url }).then(tab => {
            informer.notify(FLAGS.TAB.WEB_APP_OPENED, { tab, json });
        })
    }
    ACTIONS[FLAGS.TAB.SEND_MESSAGE_ACTIVE_TAB] = (message) => {
        currenTab().then(tab => {
            ACTIONS[FLAGS.TAB.SEND_MESSAGE]({ ...message, tab });
        });
    }
    return OnDoDoOn(informer, ACTIONS);
}