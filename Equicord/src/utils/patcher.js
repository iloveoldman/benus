// src/plugins/"plugin name"/patcher.js

/**
 * Hooks a function so that your callback runs after it executes.
 * @param {string} name - Function name (for debugging/logging)
 * @param {object|null} target - The object that contains the function
 * @param {(args: any[], res: any) => any} callback - Called with arguments and result of the original function
 * @returns {() => void} - Function to unpatch
 */
export function after(name, target, callback) {
    // If no target is provided, assume global scope
    if (!target) {
        console.warn(`[after] No target provided for function "${name}"`);
        return () => {};
    }

    const original = target[name];
    if (typeof original !== "function") {
        console.warn(`[after] Target function "${name}" not found`);
        return () => {};
    }

    target[name] = function (...args) {
        const res = original.apply(this, args);
        return callback(args, res) ?? res;
    };

    // Return a function to unpatch
    return () => {
        target[name] = original;
    };
}
