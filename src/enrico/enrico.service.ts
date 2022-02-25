import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fetch from 'cross-fetch';
import { type } from 'os';
import { Like, Repository } from 'typeorm';
import { Countries } from './entities/countries.entity';
import { Days } from './entities/days.entity';
import { Holidays } from './entities/holidays.entity';
import { Max } from './entities/max.entity';
import { DayType } from './static/action.enum';

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

  async getAllCountries(): Promise<Countries[]> {
    const counter: number = await this.repositoryCountry.count();

    if (counter === 0) {
      try {
        const countries: Countries[] = [];

        const response = await fetch(`${process.env.URL}getSupportedCountries`);
        const data = await response.json();

        for (const obj of data) {
          countries.push(obj);
        }

        return this.repositoryCountry.save(countries);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      console.log('Reading from Table countries');
      return this.repositoryCountry.find();
    }
  }

  async getHolidaysByMonth(
    month: string,
    year: string,
    countryCode: string,
  ): Promise<Holidays[]> {
    const holidaysByMonth: Holidays[] = [];
    const holidays = await this.repositoryHolidays.find({
      date: Like(`${year}-${month}-%`),
      countryCode: countryCode,
    });

    if (holidays.length === 0) {
      try {
        const response = await fetch(
          `${process.env.URL}getHolidaysForYear&year=${year}&country=${countryCode}&holidayType=public_holiday`,
        );
        const data = await response.json();

        for (const obj of data) {
          const objMonth: number = obj.date.month;

          if (objMonth === parseInt(month)) {
            const date: string = year + '-' + month + '-' + obj.date.day;

            holidaysByMonth.push(
              this.repositoryHolidays.create({
                countryCode,
                date,
                name: obj.name[1].text,
                dayOfWeek: obj.date.dayOfWeek,
              }),
            );
          }
        }
        return this.repositoryHolidays.save(holidaysByMonth);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      console.log('Reading from Table holidays');
      return holidays;
    }
  }

  async getDayStatus(date: string, countryCode: string): Promise<Days> {
    const result = {
      isPublicHoliday: false,
      isWorkDay: false,
      isFreeDay: false,
    };
    let type: string = '';
    let dateSplit: string[] = date.split('-');
    let reformatedDate = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];

    const dayStatus = await this.repositoryDays.findOne({
      countryCode: countryCode,
      date: reformatedDate,
    });

    if (!dayStatus) {
      try {
        const response = await fetch(
          `${process.env.URL}isPublicHoliday&date=${date}&country=${countryCode}`,
        );
        const data = await response.json();
        result[DayType.IS_PUBLIC_DAY] = data.isPublicHoliday;

        if (response.status === 200) {
          const response = await fetch(
            `${process.env.URL}isWorkDay&date=${date}&country=${countryCode}`,
          );
          const data = await response.json();
          result[DayType.IS_WORK_DAY] = data.isWorkDay;

          if (
            result[DayType.IS_PUBLIC_DAY] === true ||
            result[DayType.IS_WORK_DAY] === true
          ) {
            result[DayType.IS_FREE_DAY] = true;
          }

          result[DayType.IS_PUBLIC_DAY] === true
            ? (type = DayType.IS_PUBLIC_DAY)
            : result[DayType.IS_WORK_DAY]
            ? (type = DayType.IS_WORK_DAY)
            : (type = DayType.IS_FREE_DAY);

          if (response.status === 200) {
            const status = this.repositoryDays.create({
              date: reformatedDate,
              countryCode,
              type,
            });
            return this.repositoryDays.save(status);
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    } else {
      return dayStatus;
    }
  }

  async getMaxDays(year: string, countryCode: string): Promise<Max> {
    async function getDates(date: string, action: string) {
      const fullDate = new Date(date);
      action === '+'
        ? fullDate.setDate(fullDate.getDate() + 1)
        : fullDate.setDate(fullDate.getDate() - 1);
      const year = fullDate.getFullYear();
      const month = ('0' + (fullDate.getMonth() + 1)).slice(-2);
      const day = ('0' + fullDate.getDate()).slice(-2);
      const data = day + '-' + month + '-' + year;
      return data;
    }

    const maxDays = await this.repositoryMax.findOne({
      countryCode,
      year,
    });

    if (!maxDays) {
      try {
        const response = await fetch(
          `${process.env.URL}getHolidaysForYear&year=${year}&country=${countryCode}&holidayType=public_holiday`,
        );
        const data = await response.json();

        let max = 0;
        for (const obj of data) {
          let count = 0;

          let year = obj.date.year;
          let month = ('0' + obj.date.month).slice(-2);
          let day = ('0' + obj.date.day).slice(-2);
          let date = day + '-' + month + '-' + year;

          let status = await this.getDayStatus(date, countryCode);
          date = await getDates(status.date, '-');

          const prevDateStatus = await this.getDayStatus(date, countryCode);

          if (prevDateStatus.type === DayType.IS_FREE_DAY) {
            count = 1;
          }

          while (
            status.type === DayType.IS_PUBLIC_DAY ||
            status.type === DayType.IS_FREE_DAY
          ) {
            count++;
            if (max < count) max = count;
            date = await getDates(status.date, '+');
            status = await this.getDayStatus(date, countryCode);
          }
        }

        const maximum = this.repositoryMax.create({
          countryCode,
          year,
          max,
        });

        return this.repositoryMax.save(maximum);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      console.log('Reading from Table max');
      return maxDays;
    }
  }
}
