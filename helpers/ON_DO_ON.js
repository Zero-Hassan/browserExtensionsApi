export default function OnDoDoOn(informer, ACTIONS) {

    const DO_ON = {};
    const ON_DO = {};

    informer.on((flag, data) => {
        if (DO_ON[flag]) {
            DO_ON[flag].map(({ action_name, args }) => {
                ACTIONS[action_name]({ ...data, ...args }, action_name, flag);
            });

        }
        if (ON_DO[flag]) {
            ON_DO[flag].map(callBack => callBack(data, flag));
        }

    });

    return {
        do: function (action_name) {
            const parent = this;
            return {
                on: function (flag, args) {
                    if (!ACTIONS[action_name]) return parent;
                    if (Array.isArray(flag)) {
                        flag.map(f => {
                            if (!DO_ON[f]) DO_ON[f] = [];
                            DO_ON[f].push({ action_name, args });
                        });
                    }
                    else {
                        if (!DO_ON[flag]) DO_ON[flag] = [];
                        DO_ON[flag].push({action_name, args});
                    }
                    return parent;
                }
            }
        },
        on: function (action_name) {
            const parent = this;
            return {
                do: function (callBack) {
                    if (typeof callBack === 'function') {
                        if (!ON_DO[action_name]) ON_DO[action_name] = [];
                        ON_DO[action_name].push(callBack);
                        return parent;
                    }
                }
            }
        },
        getDoOn:function(flag){
            return DO_ON[flag];
        },
        getOnDo:function(action_name){
            return ON_DO[action_name];
        }
    }
}