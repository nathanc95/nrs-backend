module.exports = class CountyService {
    countyRepository = null;

    constructor(countyRepository) {
        this.countyRepository = countyRepository;
    }

    async mainCounty(countyName) {
        console.debug('trying to retrieve county data', {countyName});
        try {
            const res = await Promise.all([
                this.countyRepository.fetchCountyPerState(countyName),
                this.countyRepository.fetchSumOfPopulationsPerCounty(countyName)
            ])
            const countiesDetails = res[0] ?? [];
            const sumDetails = res[1] ?? [];
            console.debug('successfully retrieved county data', {sumDetails})
            return {
                countiesDetails,
                sumDetails
            };
        } catch (err) {
            throw err;
        }
    }
}
