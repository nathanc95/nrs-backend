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
Object.defineProperty(exports, "__esModule", { value: true });
var dbMigrateUtils = require('./dbMigrateUtils');
var helpers = require('pg-promise')().helpers;
// States Data
var jsonObjects = require('../assets/usaStates.json');
var Migrate = /** @class */ (function () {
    function Migrate(dbConnection) {
        this.dbConnection = null;
        this.dbConnection = dbConnection;
    }
    Migrate.prototype.verifyStructure = function () {
        return __awaiter(this, void 0, void 0, function () {
            var validTables, checkCountieQuery, checkStateCountieQuery, resCheckCountie, err_1, resCheckState, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug('init the structure');
                        validTables = {
                            state: false,
                            counties: false
                        };
                        checkCountieQuery = "select count(id) from counties";
                        checkStateCountieQuery = "select count(id) from states";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dbConnection.oneOrNone(checkCountieQuery)];
                    case 2:
                        resCheckCountie = _a.sent();
                        if (resCheckCountie !== undefined && parseInt(resCheckCountie.count, 10) > 0) {
                            validTables.counties = true;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.dbConnection.oneOrNone(checkStateCountieQuery)];
                    case 5:
                        resCheckState = _a.sent();
                        if (resCheckState !== undefined && parseInt(resCheckState.count, 10) > 0) {
                            validTables.state = true;
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        console.debug('done init the structure');
                        return [2 /*return*/, validTables];
                }
            });
        });
    };
    Migrate.prototype.initTables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug('trying to init the tables');
                        query = "    \n        CREATE TABLE IF NOT EXISTS states\n        (\n            id         SERIAL PRIMARY KEY,\n            state       varchar(70)  not null unique,\n            population int          not null,\n            counties   int          not null,\n            detail     varchar(250) null\n        );\n        \n        \n        CREATE TABLE IF NOT EXISTS counties\n        (\n            id         SERIAL PRIMARY KEY,\n            county     varchar(100) not null,\n            population int          not null,\n            stateId    int,\n            CONSTRAINT fk_stateId\n                FOREIGN KEY (stateId)\n                    REFERENCES states (id)\n        );";
                        return [4 /*yield*/, this.dbConnection.query(query)];
                    case 1:
                        _a.sent();
                        console.debug('done init the tables');
                        return [2 /*return*/];
                }
            });
        });
    };
    Migrate.prototype.massStateInsert = function () {
        return __awaiter(this, void 0, void 0, function () {
            var template;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug('massStateInsert');
                        template = helpers.insert(jsonObjects, ['state', 'population',
                            'counties', 'detail'], 'states');
                        return [4 /*yield*/, this.dbConnection.query(template)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Migrate.prototype.massCountiesInsert = function (countiesContent) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchAllStatesQuery, fetchStateAll, mergedCounties, template;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug('massCountiesInsert');
                        fetchAllStatesQuery = "select id, state from states";
                        return [4 /*yield*/, this.dbConnection.any(fetchAllStatesQuery)];
                    case 1:
                        fetchStateAll = _a.sent();
                        mergedCounties = [];
                        countiesContent.map(function (countie) {
                            var stateName = countie.stateName;
                            var stateId = fetchStateAll.filter(function (state) { return state.state.replace(/ /g, '').toLowerCase() === stateName.toLowerCase(); });
                            countie.countiesData.map(function (data) {
                                data.stateid = stateId[0].id;
                                mergedCounties.push(data);
                            });
                        });
                        template = helpers.insert(mergedCounties, ['county', 'population', 'stateid'], 'counties');
                        return [4 /*yield*/, this.dbConnection.query(template)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Migrate.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var existTables, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug('setting up the database');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, this.verifyStructure()];
                    case 2:
                        existTables = _a.sent();
                        // first we need to create the tables
                        return [4 /*yield*/, this.initTables()];
                    case 3:
                        // first we need to create the tables
                        _a.sent();
                        if (!!existTables.state) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.massStateInsert()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!!existTables.counties) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.massCountiesInsert(dbMigrateUtils.requireJsonFiles(dbMigrateUtils.jsonCountiesData))];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        console.debug('done setting up the database');
                        return [3 /*break*/, 9];
                    case 8:
                        err_3 = _a.sent();
                        return [2 /*return*/, err_3];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return Migrate;
}());
exports.default = Migrate;
