"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md
// https://github.com/joschan21/drizzle-planetscale-starter/blob/master/src/app/page.tsx
require("dotenv/config");
var postgres_js_1 = require("drizzle-orm/postgres-js");
var migrator_1 = require("drizzle-orm/postgres-js/migrator");
var postgres_1 = __importDefault(require("postgres"));
var runMigrate = function (migrationsFolder) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, db, start, end;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!process.env.DATABASE_URL) {
                    throw new Error('DATABASE_URL is not defined');
                }
                sql = (0, postgres_1.default)(process.env.DATABASE_URL, { max: 1 });
                db = (0, postgres_js_1.drizzle)(sql);
                // eslint-disable-next-line no-console
                console.log('⏳ Running migrations...');
                start = Date.now();
                return [4 /*yield*/, (0, migrator_1.migrate)(db, { migrationsFolder: migrationsFolder })];
            case 1:
                _a.sent();
                end = Date.now();
                // eslint-disable-next-line no-console
                console.log("\u2705 Migrations completed in ".concat(end - start, "ms"));
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); };
runMigrate(process.argv[2]).catch(function (err) {
    console.error('❌ Migration failed');
    console.error(err);
    process.exit(1);
});
