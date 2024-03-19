import CountryRepository from "../repository/countyRepository";

export default class CountryService {
    constructor(private countyRepository: CountryRepository) {
        this.countyRepository = countyRepository;
    }

    async mainCounty(countyName: number) {
        console.debug(`trying to retrieve county data ${countyName}`);
        try {
            const countiesDetails =  await this.countyRepository.fetchCountyPerState(countyName);
            const sumDetails = await this.countyRepository.fetchSumOfPopulationsPerCounty(countyName);
            console.debug(`successfully retrieved county data ${sumDetails}`)
            return {
                countiesDetails,
                sumDetails
            };
        } catch (err) {
            throw err;
        }
    }
}
