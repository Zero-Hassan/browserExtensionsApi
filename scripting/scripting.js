import FLAGS from "../constants/ACTIONS";
import OnDoDoOn from "../helpers/ON_DO_ON";


const canIject = (url,except) => {
    if (url.startsWith("chrome://") || url.startsWith("https://chrome.google")) return false;
    if(except.filter(u=>url.startsWith(u)).length>0) return false;
    return true;
}
export function injectJsFile(tab, fileName,except=[], callBack) {
    const { id, url,pendingUrl } = tab;
    if (canIject(pendingUrl || url,except)) {
        chrome.scripting.executeScript(
            {
                target: { tabId: id, allFrames: true },
                files: [fileName],
            }).then(() => {
                callBack(tab);
            }, () => {
                callBack({ forbiden: true })
            })
    } else {
        callBack({ forbiden: true });
    }

}

export function injectCss(tab, fileName, callBack) {
    const { id, url } = tab;
    if (canIject(url)) {
        chrome.scripting.insertCSS(
            {
                target: { tabId: id, allFrames: true },
                files: [fileName],
            }, () => {
                callBack(tab);
            });
    } else {
        callBack({ forbiden: true });
    }
}

export function Scripting(informer) {
    const ACTIONS = {};
    ACTIONS[FLAGS.SCRIPT.INJECT_JS] = ({ tab, file_name,except }) => {
        let response_recieved = false;
        injectJsFile(tab, file_name,except, (data) => {
            response_recieved = true;
            if (data && data.id) informer.notify(FLAGS.SCRIPT.JS_INJECTED, { tab });
        })
        setTimeout(() => {
            if (!response_recieved) informer.notify(FLAGS.SCRIPT.JS_TIME_OUT, { tab });
        }, 1000);
    }
    return OnDoDoOn(informer, ACTIONS);
}