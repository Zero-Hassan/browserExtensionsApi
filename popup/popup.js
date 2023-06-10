
import FLAGS from "../constants/ACTIONS";
import OnDoDoOn from "../helpers/ON_DO_ON";
import ELEMENT_TAG from "../html/webComponents/ELEMENTS_TAG";
import { LIST_ATTRIBUTE } from "../html/webComponents/List";
import { POPUP_ATTRIBUTE } from "../html/webComponents/Popup";


export const POP_UP_ACTIONS_ICONS=[
    {icon:"view",name:FLAGS.TABLE.VIEW},
    {icon:"copy",name:FLAGS.TABLE.COPY_TO_CLIPBOARD},
    {icon:"csv",name:FLAGS.TABLE.EXPORT_TO_CSV},
    {icon:"excel",name:FLAGS.TABLE.EXPORT_TO_EXCEL}
]
const setUp = (callBack) => {
    const root = document.getElementById("root");
    const popup = document.createElement(ELEMENT_TAG.POPUP);
    popup.setAttribute(POPUP_ATTRIBUTE.TITLE, 'TableExtractor');
    root.appendChild(popup);
    popup.setHeaderActions([{ name: 'help', icon: 'help', label: 'Help' }])
    if (typeof callBack === 'function') callBack();
    return [popup, root]
};

function parseList(tables, length) {
    const list = [];
    for (let t = 0; t < length; t++) {
        const { caption: label, key } = tables[t];
        list.push({ label, key, actions: POP_UP_ACTIONS_ICONS })
    }
    return JSON.stringify(list);
}
const displayResults = (tables, popup, onAction) => {
    const length = tables.length;
    const list = document.createElement(ELEMENT_TAG.LIST);
    list.setAttribute(LIST_ATTRIBUTE.ITEMS, parseList(tables, length));
    list.setAttribute(LIST_ATTRIBUTE.TITLE, `(<b>${length || 0}</b>) HTML tables found`);
    list.onAction = onAction;
    popup.setBody(list);
};
export default function PopUp(informer) {
    const ACTIONS = {};
    let popup = null;
    let root = null;
    let Tab = null;

    const onAction = (action,key)=>{
        informer.notify(FLAGS.TABLE.DO,{type:FLAGS.TABLE.DO,key,tab:Tab,action});
    };

    ACTIONS[FLAGS.POPUP.SET_UP] = ({ tab }) => {
        Tab = tab;
        [popup, root] = setUp(() => {
            informer.notify(FLAGS.POPUP.READY, { tab });
        });
    }
    ACTIONS[FLAGS.POPUP.DISPLAY_TABLES_LIST] = ({ tab, length, tables }) => {
        displayResults(tables, popup, onAction);
    }
    return {
        ...OnDoDoOn(informer, ACTIONS),
        setTab: function (tab) {
            Tab = tab;
        }
    };
}