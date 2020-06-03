function deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;

    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor) return false;

        let length, i;
        if (Array.isArray(a) && Array.isArray(b)) {
            length = a.length;
            if (length != b.length) return false;
            for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
            return true;
        }

        if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) return false;
            for (i of a.entries()) if (!b.has(i[0])) return false;
            for (i of a.entries()) if (!deepEqual(i[1], b.get(i[0]))) return false;
            return true;
        }

        if (a instanceof Set && b instanceof Set) {
            if (a.size !== b.size) return false;
            for (i of a.entries()) if (!b.has(i[0])) return false;
            return true;
        }

        if (a instanceof RegExp && b instanceof RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

        const keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;

        for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

        const aRecord = a as Record<string, unknown>;
        const bRecord = b as Record<string, unknown>;
        for (i = length; i-- !== 0;) {
            const key = keys[i];
            if (!deepEqual(aRecord[key], bRecord[key])) return false;
        }

        return true;
    }

    return a !== a && b !== b;
}

export default deepEqual;
