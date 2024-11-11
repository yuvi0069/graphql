"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pMapSerial = pMapSerial;
async function pMapSerial(arr, fn) {
    let overallPromise = Promise.resolve([]);
    const resArr = [];
    arr.forEach((element) => {
        overallPromise = overallPromise
            .then(async (i) => fn(element))
            .then((r) => resArr.push(r));
    });
    await overallPromise;
    return resArr;
}
//# sourceMappingURL=async.js.map