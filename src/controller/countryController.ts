import {Request, Response} from 'express';

import DB from '../repository/postgre/db';

import CountryRepository from "../repository/countyRepository";
import CountryService from '../services/countyService';

import countryDto from '../models/dto/countryDto';

export default class CountryController {

    private countryService: CountryService
    private readonly countryRepository: CountryRepository
    private readonly db: DB

    constructor() {
        this.db = new DB();
        this.countryRepository = new CountryRepository(this.db);
        this.countryService = new CountryService(this.countryRepository);
    }

    async getCountryById(req: Request, res: Response) {
        const countryId = parseInt(req.params.id, 10);

        if (!countryDto.validateCountryDTO({countryId})) {
            return res.status(400).json({
                success: false,
                errorMessage: 'Invalid county provided',
            });
        }

        const resMainCounty = await this.countryService.mainCounty(countryId);
        return res.send(resMainCounty);
    }
}
