import FLAGS from "./ACTIONS"


export const CONTENT_SCRIPT={
    NAME:'contentFile',
    PATH:'content.js'
}
export const  WEB_APP_SCRIPT={
    PATH:'web_app.js'
}
export const CONTENT_SCRIPT_={
    id:'content_script',
    js:["content.js"],
    matches:["<all_urls>"],
    allFrames:true
}
export const POPUP={
    PATH:'index.html'
}

export const TABLE_KEY='ext-table-key'
export const WEB_APP_URL={
    [FLAGS.TABLE.EXPORT_TO_EXCEL]:'http://localhost:3000/extensions/html_table_extractor/export_to_excel',
    [FLAGS.TABLE.EXPORT_TO_CSV]:'http://localhost:3000/extensions/html_table_extractor/export_to_csv'
}