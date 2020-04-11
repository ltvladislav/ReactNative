
export default class Livlag {
    static isEmpty = (arg) => {
        return arg instanceof Array ? !arg.length : !arg;
    }
    static objectIsEmpty(obj) {
        for (let key in obj) {
            if (obj[key]) {
                return false;
            }
        }
        return true;
    }

    static callback(callback, args, scope) {
        if (!callback) {
            return;
        }
        if (!args) {
            if (scope) {
                callback.call(scope);
            }
            else {
                callback();
            }
            return;
        }
        if (args instanceof Array) {
            if (scope) {
                callback.apply(scope, args);
            }
            else {
                callback.apply(null, args);
            }
            return;
        }
        if (scope) {
            callback.call(scope, args);
        }
        else {
            callback(args);
        }
    }

    static each(value, callback, scope) {
        for (let key in value) {
            Livlag.callback(callback, [value[key], key], scope);
        }
    }
}