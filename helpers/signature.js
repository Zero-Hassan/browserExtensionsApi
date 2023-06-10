import { extentionId } from "../runtime/runtime";

export function setFileKey(key) {
    const ext_key=extentionId();
    const id=`${ext_key}__${key}`;
   if(document.getElementById(id)) return false;
   const input=document.createElement('input');
   input.setAttribute(`${ext_key}__${key}`,key);
   input.setAttribute('id',id);
   input.setAttribute('type','hidden');
   document.body.appendChild(input);
}

export function getContentFileKey(key) {
    const id=`${extentionId()}__${key}`;
    return{
        func:function(id){
            return document?.getElementById(id)?.getAttribute(id);
        },
        args:[id]
    } ;
}