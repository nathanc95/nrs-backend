"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CountryDto = /** @class */ (function () {
    function CountryDto() {
    }
    CountryDto.validateCountryDTO = function (dto) {
        return !isNaN(dto.countryId);
    };
    return CountryDto;
}());
exports.default = CountryDto;
