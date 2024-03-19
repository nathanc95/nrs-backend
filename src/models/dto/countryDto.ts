export interface CountryDTO {
    countryId: number;
}

export default class CountryDto {
    static validateCountryDTO(dto: CountryDTO): boolean {
        return !isNaN(dto.countryId);
    }
}
