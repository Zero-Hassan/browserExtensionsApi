import FLAGS from "../constants/ACTIONS";
import OnDoDoOn from "../helpers/ON_DO_ON";

const getData=(key)=>{
    return chrome.storage.local.get([key]).then(data=>{
         console.log(data,key);
        return data[key];});
}


const store=async (root_key,value)=>{
    let root= await getData(root_key);
    console.log({
        root_key,
        root,
        value
    });
    const{key}=value;
    value.created_at=Date.now();
    if(!root){ 
        console.log("not yet");
        root={};
    }
    if(value.type==='folder'){
        if(!root.folders) root.folders={};
         root.folders[key]=value;
        }else{
            if(!root.items) root.items={};
            root.items[key]=value;
        }   
    return chrome.storage.local.set({[root_key]:root});
}



export default function Storage(informer){
    const ACTIONS={};
    ACTIONS[FLAGS.STORAGE.SET]=({key,data})=>{
        store(key,data).then(()=>{
            informer.notify(FLAGS.STORAGE.STORED);
        });
    }
    
    ACTIONS[FLAGS.STORAGE.GET]=({root_key})=>{
        getData(root_key).then(data=>informer.notify(FLAGS.STORAGE.DATA_READY,{root_key,data}));
    }
    return OnDoDoOn(informer,ACTIONS);
}