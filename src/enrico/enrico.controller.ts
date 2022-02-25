import { Controller, Get, Param } from '@nestjs/common';
import { EnricoService } from './enrico.service';

@Controller('enrico')
export class EnricoController {
  constructor(private readonly enricoService: EnricoService) {}
  @Get('/countries')
  getAllCountries() {
    return this.enricoService.getAllCountries();
  }

  @Get('/year/:year/countrycode/:countryCode')
  getMaxDays(
    @Param('year') year: string,
    @Param('countryCode') countryCode: string,
  ) {
    return this.enricoService.getMaxDays(year, countryCode);
  }

  @Get('/month/:month/year/:year/countrycode/:countryCode')
  getHolidaysByMonth(
    @Param('month') month: string,
    @Param('year') year: string,
    @Param('countryCode') countryCode: string,
  ) {
    return this.enricoService.getHolidaysByMonth(month, year, countryCode);
  }

  @Get('/date/:date/countrycode/:countryCode')
  getDays(
    @Param('date') date: string,
    @Param('countryCode') countryCode: string,
  ) {
    return this.enricoService.getDayStatus(date, countryCode);
  }
}
