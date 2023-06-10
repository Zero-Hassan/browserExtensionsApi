export const registerAction = (EVENTS) => (event_name, action) => {
    if (!EVENTS[event_name]) EVENTS[event_name] = [];
    if (typeof action === 'function') {
        EVENTS[event_name].push(action);
    }
}

export const registerFlags = (FLAGS) => (action, flags, data = true) => {
    if (!FLAGS[action]) FLAGS[action] = {};
    if (Array.isArray(flags)) {
        flags.map(flag => FLAGS[action][flag] = data);
    } else {
        FLAGS[action][flags] = data;
    }
}

export const excuteOnActions = (ON_ACTION) => (event_name, data) => {
    if (ON_ACTION[event_name]) {
        ON_ACTION[event_name].map(action => action(data));
    }
}