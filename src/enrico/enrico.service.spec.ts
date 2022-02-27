import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnricoService } from './enrico.service';
import { Countries } from './entities/countries.entity';
import { Days } from './entities/days.entity';
import { Holidays } from './entities/holidays.entity';
import { Max } from './entities/max.entity';

describe('EnricoService', () => {
  let service: EnricoService;
  let countriesRepository: Repository<Countries>;
  let holidaysRepository: Repository<Holidays>;
  let daysRepository: Repository<Days>;
  let maxRepository: Repository<Max>;

  const COUNTRIES_REPOSITORY_TOKEN = getRepositoryToken(Countries);
  const countryOne = {
    id: 1,
    countryCode: 'ltu',
    fullName: 'Lithuania',
  };
  const countryTwo = {
    id: 2,
    countryCode: 'aus',
    fullName: 'Australia',
  };
  const countries = [countryOne, countryTwo];

  const HOLIDAYS_REPOSITORY_TOKEN = getRepositoryToken(Holidays);
  const holidays = [
    {
      id: 1,
      countryCode: 'ltu',
      date: '2022-5-1',
      name: 'Labour Day',
      dayOfWeek: 7,
    },
    {
      id: 2,
      countryCode: 'ltu',
      date: '2022-5-1',
      name: "Mother's Day",
      dayOfWeek: 7,
    },
  ];

  const DAYS_REPOSITORY_TOKEN = getRepositoryToken(Days);
  const dayStatus = {
    id: 1,
    date: '2022-02-16',
    countryCode: 'ltu',
    type: 'isPublicDay',
  };

  const MAX_REPOSITORY_TOKEN = getRepositoryToken(Max);
  const maxDays = {
    id: 1,
    countryCode: 'ltu',
    year: '2023',
    max: 4,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnricoService,
        {
          provide: COUNTRIES_REPOSITORY_TOKEN,
          //Arrange
          useValue: {
            count: jest.fn().mockImplementation(() => {
              return countries.length;
            }),
            save: jest.fn().mockImplementation((countries) => countries),
            find: jest.fn().mockImplementation(() => {
              return countries;
            }),
          },
        },
        {
          provide: HOLIDAYS_REPOSITORY_TOKEN,
          //Arrange
          useValue: {
            find: jest.fn().mockImplementation(() => {
              return holidays;
            }),
            create: jest.fn().mockImplementation((holidays) => holidays),
            save: jest.fn().mockImplementation((holidays) => holidays),
          },
        },
        {
          provide: DAYS_REPOSITORY_TOKEN,
          //Arrange
          useValue: {
            findOne: jest.fn().mockImplementation(() => {
              return dayStatus;
            }),
            create: jest.fn().mockImplementation((dayStatus) => dayStatus),
            save: jest.fn().mockImplementation((dayStatus) => dayStatus),
          },
        },
        {
          provide: MAX_REPOSITORY_TOKEN,
          //Arrange
          useValue: {
            findOne: jest.fn().mockImplementation(() => {
              return maxDays;
            }),
            create: jest.fn().mockImplementation((maxDays) => maxDays),
            save: jest.fn().mockImplementation((maxDays) => maxDays),
          },
        },
      ],
    }).compile();

    service = module.get<EnricoService>(EnricoService);
    countriesRepository = module.get<Repository<Countries>>(
      COUNTRIES_REPOSITORY_TOKEN,
    );
    holidaysRepository = module.get<Repository<Holidays>>(
      HOLIDAYS_REPOSITORY_TOKEN,
    );
    daysRepository = module.get<Repository<Days>>(DAYS_REPOSITORY_TOKEN);
    maxRepository = module.get<Repository<Max>>(MAX_REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCountries', () => {
    it('countriesRepository should be defined', () => {
      expect(countriesRepository).toBeDefined();
    });
    it('get all countries', async () => {
      //Act
      const countCountries = countriesRepository.count();
      const foundCountries = countriesRepository.find();
      const result = await service.getAllCountries();

      //Assert
      expect(countCountries).toEqual(2);
      expect(result).toBe(foundCountries);
    });
  });

  describe('getHolidaysByMonth', () => {
    it('holidaysRepository should be defined', () => {
      expect(holidaysRepository).toBeDefined();
    });

    it('get holidays by month for year and country', async () => {
      //Act
      const foundHolidays = holidaysRepository.find();
      const result = await service.getHolidaysByMonth('5', '2022', 'ltu');

      //Assert
      expect(result).toBe(foundHolidays);
    });
  });

  describe('getDayStatus', () => {
    it('daysRepository should be defined', () => {
      expect(daysRepository).toBeDefined();
    });

    it('get day status', async () => {
      //Act
      const foundDayStatus = daysRepository.findOne();
      const result = await service.getDayStatus('16-02-2022', 'ltu');

      //Assert
      expect(result).toBe(foundDayStatus);
    });
  });

  describe('getMaxDays', () => {
    it('maxRepository should be defined', () => {
      expect(maxRepository).toBeDefined();
    });

    it('get max days in a row', async () => {
      //Act
      const foundMaxDays = maxRepository.findOne();
      const result = await service.getMaxDays('2023', 'ltu');

      //Assert
      expect(result).toBe(foundMaxDays);
    });
  });
});
