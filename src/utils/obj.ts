type DeepCloneType = {
    <T extends { [key: string]: any }>(obj: T): T;
}

export const deepClone: DeepCloneType = <T extends { [key: string]: any }>(obj: T) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    const result: { [key: string]: any } = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = typeof obj[key] === 'object' 
                ? deepClone(obj[key]) 
                : obj[key];
        }
    });
    return result as T;
};