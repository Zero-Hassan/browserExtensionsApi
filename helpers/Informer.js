export default function Informer(ON) {

    const listeners = [];
    return {
        on: function (action) {
            listeners.push(action);
        },
        listen: function (FLAGS, ACTIONS) {
            this.on((flag, data) => {
                for (const action in FLAGS) {
                    if (Object.hasOwnProperty.call(FLAGS, action)) {
                        if (FLAGS[action][flag]) ACTIONS[action](data,FLAGS[action][flag]);
                    }
                }
            });
        },
        notify: function (flag, data) {
            listeners.forEach(listener => listener(flag, data));
            if(ON && typeof ON[flag] === 'function') ON[flag](data);

        }
    }
}

export const Notifier=(Informer)=>(flag,extraData)=>(data)=>Informer.notify(flag,{...data,extraData});