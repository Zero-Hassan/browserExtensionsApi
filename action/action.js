import FLAGS from "../constants/ACTIONS";
import OnDoDoOn from "../helpers/ON_DO_ON";

export function setBadge(text) {
    chrome.action.setBadgeText({ text: '' + text });
}

export function setPopup(tabId, popup) {
    return chrome.action.setPopup({ popup, tabId });
}

export function onActionClicked(action) {
    chrome.action.onClicked.addListener(
        (tab) => {
            if (typeof action === 'function') action(tab);
        },
    )
}

export function showPopup() {
    return chrome.action.openPopup()
}

export default function _Action(informer) {
    const ACTIONS = {};
    const ondo_doon = OnDoDoOn(informer, ACTIONS);

    chrome.action.onClicked.addListener(
        (tab) => {
           informer.notify(FLAGS.POPUP.ACTION.CLICKED,tab);
        },
    )


    ACTIONS[FLAGS.POPUP.ACTION.SET_BADGE] = ({ length }) => {
        setBadge(length ? length : '');
    }
    ACTIONS[FLAGS.POPUP.ACTION.SET_POPUP] = ({ id, path }) => {
        setPopup(id, path);
    }
    return {
        ...ondo_doon
    }
}