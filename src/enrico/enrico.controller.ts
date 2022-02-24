import { Controller, Get, Param } from '@nestjs/common';
import { EnricoService } from './enrico.service';

@Controller('enrico')
export class EnricoController {
  constructor(private readonly enricoService: EnricoService) {}
  @Get('/countries')
  getAllCountries() {
    return this.enricoService.getAllCountries();
  }

  @Get('/max/:year/:countryCode')
  getMaxDays(
    @Param('year') year: string,
    @Param('countryCode') countryCode: string,
  ) {
    return this.enricoService.getMaxDays(year, countryCode);
  }

  @Get('/:month/:year/:countryCode')
  getHolidaysByMonth(
    @Param('month') month: number,
    @Param('year') year: number,
    @Param('countryCode') countryCode: string,
  ) {
    return this.enricoService.getHolidaysByMonth(month, year, countryCode);
  }

  @Get('/:date/:countryCode')
  getDays(
    @Param('date') date: string,
    @Param('countryCode') countryCode: string,
  ) {
    return this.enricoService.getDayStatus(date, countryCode);
  }
}
