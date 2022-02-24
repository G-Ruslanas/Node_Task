import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fetch from 'cross-fetch';
import { Repository } from 'typeorm';
import { Country, DaysStatus, HolidaysByMonth, Max } from './enrico.model';
import { Countries } from './entities/countries.entity';
import { Days } from './entities/days.entity';
import { Holidays } from './entities/holidays.entity';

@Injectable()
export class EnricoService {
  constructor(
    @InjectRepository(Countries)
    private readonly repositoryCountry: Repository<Countries>,
    @InjectRepository(Holidays)
    private readonly repositoryHolidays: Repository<Holidays>,
    @InjectRepository(Days) private readonly repositoryDays: Repository<Days>,
    @InjectRepository(Max) private readonly repositoryMax: Repository<Max>,
  ) {}

  async getAllCountries() {
    if ((await this.repositoryCountry.count()) == 0) {
      try {
        const countries: Country[] = [];
        const response = await fetch(
          'https://kayaposoft.com/enrico/json/v2.0/?action=getSupportedCountries',
        );
        const data = await response.json();
        data.map((o) => {
          const newCountry = new Country(o.countryCode, o.fullName);
          countries.push(newCountry);
        });
        this.repositoryCountry.save(countries);
        return countries;
      } catch (error) {
        throw new Error('Unexpected error occurred');
      }
    } else {
      console.log('Reading from Table countries');
      return await this.repositoryCountry.find();
    }
  }
  async getHolidaysByMonth(month: number, year: number, countryCode: string) {
    const holidaysByMonth: HolidaysByMonth[] = [];
    const query = await this.repositoryHolidays
      .createQueryBuilder()
      .select('holidays')
      .from(Holidays, 'holidays')
      .where('holidays.countryCode = :id', { id: countryCode })
      .andWhere('holidays.date like :date', { date: `${year}-${month}-%` })
      .getMany();
    if (query.length === 0) {
      try {
        const response = await fetch(
          `https://kayaposoft.com/enrico/json/v2.0?action=getHolidaysForYear&year=${year}&country=${countryCode}&holidayType=public_holiday`,
        );
        const data = await response.json();
        data.map((o) => {
          if (o.date.month == month) {
            const date: string = year + '-' + month + '-' + o.date.day;
            return o.name.map((n) => {
              if (n.lang === 'en') {
                const newHoliday = new HolidaysByMonth(
                  countryCode,
                  date,
                  n.text,
                  o.date.dayOfWeek,
                );
                holidaysByMonth.push(newHoliday);
              }
            });
          }
        });
        await this.repositoryHolidays.save(holidaysByMonth);
        return holidaysByMonth;
      } catch (error) {
        throw new Error('Unexpected error occurred');
      }
    } else {
      console.log('Reading from Table holidays');
      return query;
    }
  }

  async getDayStatus(date: string, countryCode: string) {
    let type: string = '';
    const result = {
      isPublicHoliday: false,
      isWorkDay: false,
      isFreeDay: false,
    };
    let dateSplit: string[] = date.split('-');
    let reformDate = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
    const query = await this.repositoryDays
      .createQueryBuilder()
      .select('days')
      .from(Days, 'days')
      .where('days.countryCode = :id', { id: countryCode })
      .andWhere('days.date = :date', { date: reformDate })
      .getOne();
    if (query === undefined) {
      try {
        const response = await fetch(
          `https://kayaposoft.com/enrico/json/v2.0/?action=isPublicHoliday&date=${date}&country=${countryCode}`,
        );
        const data = await response.json();
        result['isPublicHoliday'] = data.isPublicHoliday;
        if (response.status === 200) {
          const res = await fetch(
            `https://kayaposoft.com/enrico/json/v2.0/?action=isWorkDay&date=${date}&country=${countryCode}`,
          );
          const data = await res.json();
          result['isWorkDay'] = data.isWorkDay;
          result['isPublicHoliday'] === true || result['isWorkDay'] === true
            ? (result['isFreeDay'] = false)
            : (result['isFreeDay'] = true);

          result['isPublicHoliday'] === true
            ? (type = 'Public Day')
            : result['isWorkDay']
            ? (type = 'Work Day')
            : (type = 'Free Day');
          if (res.status === 200) {
            return await this.repositoryDays.save(
              new DaysStatus(countryCode, reformDate, type),
            );
          }
        }
      } catch (error) {
        throw new Error('Unexpected error occurred');
      }
    } else {
      return query;
    }
  }
  async getMaxDays(year: string, countryCode: string) {
    function dateRange(startDate, endDate) {
      const dateArray = [];
      let currentDate = new Date(startDate);
      while (currentDate <= new Date(endDate)) {
        const year = currentDate.getFullYear();
        const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        const day = ('0' + currentDate.getDate()).slice(-2);
        const date = day + '-' + month + '-' + year;
        dateArray.push(date);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dateArray;
    }
    try {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      const dates = dateRange(start, end);
      const obj = await this.repositoryMax.findOne({
        countryCode: countryCode,
        year: year,
      });
      let data = await this.repositoryDays
        .createQueryBuilder()
        .select('days')
        .from(Days, 'days')
        .where('days.countryCode = :id', { id: countryCode })
        .andWhere('days.date like :date', { date: `${year}-%-%` })
        .orderBy('days.date', 'ASC')
        .getMany();
      if (data.length !== 365 && data.length !== 366) {
        console.log('Uploading data to a Database');
        dates.map((d) => {
          this.getDayStatus(d, countryCode);
        });
      }

      if (obj) {
        console.log('Reading from Table max');
        return obj;
      } else if (
        data.length !== 0 &&
        (data.length === 365 || data.length === 366)
      ) {
        const dayStatus = [];
        for (let i = 0; i < data.length; i++) {
          dayStatus.push(data[i].type);
        }
        let max = 0;
        for (let i = 0; i < dayStatus.length; i++) {
          let count = 0;
          if (dayStatus[i] === 'Free Day' || dayStatus[i] === 'Public Day') {
            count = 1;
            if (max < count) max = count;
            while (
              dayStatus[i + 1] === 'Free Day' ||
              dayStatus[i + 1] === 'Public Day'
            ) {
              count++;
              if (max < count) max = count;
              i++;
            }
          }
        }
        return await this.repositoryMax.save(new Max(countryCode, year, max));
      }
    } catch (error) {
      throw new Error('Unexpected error occurred');
    }
  }
}
