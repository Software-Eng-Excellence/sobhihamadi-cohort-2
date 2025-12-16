"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const uuid_1 = require("uuid");
const generateUniqueId = (prefix) => {
    return prefix ? ` ${prefix}_${(0, uuid_1.v4)()}` : (0, uuid_1.v4)();
};
exports.generateUniqueId = generateUniqueId;
//# sourceMappingURL=index.js.map