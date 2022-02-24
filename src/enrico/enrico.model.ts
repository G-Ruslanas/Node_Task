export class Country {
  constructor(public countryCode: string, public fullName: string) {}
}

export class HolidaysByMonth {
  constructor(
    public countryCode: string,
    public date: string,
    public name: string,
    public dayOfWeek: number,
  ) {}
}

export class DaysStatus {
  constructor(
    public countryCode: string,
    public date: string,
    public type: string,
  ) {}
}

export class Max {
  constructor(
    public countryCode: string,
    public year: string,
    public max: number,
  ) {}
}
