import FLAGS from "../constants/ACTIONS";
import { TABLE_KEY } from "../constants/config";
import OnDoDoOn from "../helpers/ON_DO_ON"

export default function Window(informer){
    const ACTIONS={};

    window.onload = () => {
        informer.notify(FLAGS.WINDOW.LOAD);
    }
    ACTIONS[FLAGS.WINDOW.SCROLL_TO]=({key})=>{
        document.querySelector(`[${TABLE_KEY}="${key}"]`).scrollIntoView({
            behavior:"smooth",
            block:"end"
        });
    }
    ACTIONS[FLAGS.WINDOW.CLOSE]=()=>{
        window.close();
    }
    return OnDoDoOn(informer,ACTIONS);
}