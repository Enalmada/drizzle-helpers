"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.createRepo = void 0;
var DrizzleConnect_1 = require("./DrizzleConnect");
Object.defineProperty(exports, "connectToDatabase", { enumerable: true, get: function () { return DrizzleConnect_1.connectToDatabase; } });
var DrizzleOrm_1 = require("./DrizzleOrm");
Object.defineProperty(exports, "createRepo", { enumerable: true, get: function () { return DrizzleOrm_1.createRepo; } });
