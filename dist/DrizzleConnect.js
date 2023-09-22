"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
var postgres_js_1 = require("drizzle-orm/postgres-js");
var postgres_1 = __importDefault(require("postgres"));
// Function to connect to database
function connectToDatabase(options) {
    var nodeEnv = options.nodeEnv, databaseUrl = options.databaseUrl, schema = options.schema;
    if (nodeEnv === 'production') {
        // Directly create a new instance if in production
        var client = (0, postgres_1.default)(databaseUrl);
        return (0, postgres_js_1.drizzle)(client, { schema: schema });
    }
    else {
        // Use global variable to store client if in development
        if (!globalThis.drizzleDbClient) {
            var client = (0, postgres_1.default)(databaseUrl);
            globalThis.drizzleDbClient = (0, postgres_js_1.drizzle)(client, { schema: schema });
        }
        return globalThis.drizzleDbClient;
    }
}
exports.connectToDatabase = connectToDatabase;
