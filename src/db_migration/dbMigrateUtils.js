"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var DbMigrateUtils = /** @class */ (function () {
    function DbMigrateUtils() {
        this.jsonCountiesData = [
            '../assets/counties/Alabama.json',
            '../assets/counties/Alaska.json',
            '../assets/counties/Arizona.json',
            '../assets/counties/Arkansas.json',
            '../assets/counties/California.json',
            '../assets/counties/Colorado.json',
            '../assets/counties/Connecticut.json',
            '../assets/counties/Delaware.json',
            '../assets/counties/DistrictOfColumbia.json',
            '../assets/counties/Florida.json',
            '../assets/counties/Georgia.json',
            '../assets/counties/Hawaii.json',
            '../assets/counties/Idaho.json',
            '../assets/counties/Illinois.json',
            '../assets/counties/Indiana.json',
            '../assets/counties/Iowa.json',
            '../assets/counties/Kansas.json',
            '../assets/counties/Kentucky.json',
            '../assets/counties/Louisiana.json',
            '../assets/counties/Maine.json',
            '../assets/counties/Maryland.json',
            '../assets/counties/Massachusetts.json',
            '../assets/counties/Michigan.json',
            '../assets/counties/Minnesota.json',
            '../assets/counties/Mississippi.json',
            '../assets/counties/Missouri.json',
            '../assets/counties/Montana.json',
            '../assets/counties/Nebraska.json',
            '../assets/counties/Nevada.json',
            '../assets/counties/NewHampshire.json',
            '../assets/counties/NewJersey.json',
            '../assets/counties/NewMexico.json',
            '../assets/counties/NewYork.json',
            '../assets/counties/NorthCarolina.json',
            '../assets/counties/NorthDakota.json',
            '../assets/counties/Ohio.json',
            '../assets/counties/Oklahoma.json',
            '../assets/counties/Oregon.json',
            '../assets/counties/Pennsylvania.json',
            '../assets/counties/RhodeIsland.json',
            '../assets/counties/SouthCarolina.json',
            '../assets/counties/SouthDakota.json',
            '../assets/counties/Tennessee.json',
            '../assets/counties/Texas.json',
            '../assets/counties/Utah.json',
            '../assets/counties/Vermont.json',
            '../assets/counties/Virginia.json',
            '../assets/counties/Washington.json',
            '../assets/counties/WestVirginia.json',
            '../assets/counties/Wisconsin.json',
            '../assets/counties/Wyoming.json'
        ];
    }
    DbMigrateUtils.prototype.requireJsonFiles = function (filePaths) {
        return filePaths.map(function (filePath) {
            try {
                var statePath = path.resolve(filePath).split('/');
                var stateName = path.resolve(filePath)
                    .split('/')[statePath.length - 1]
                    .replace('.json', '');
                var countiesData = require(filePath);
                return {
                    stateName: stateName,
                    countiesData: countiesData,
                };
            }
            catch (error) {
                console.error("Error requiring file:", error);
                return null;
            }
        });
    };
    return DbMigrateUtils;
}());
exports.default = new DbMigrateUtils();
