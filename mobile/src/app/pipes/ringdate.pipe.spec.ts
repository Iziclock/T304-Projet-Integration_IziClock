import { RingdatePipe } from './ringdate.pipe';

describe('RingdatePipe', () => {
  let pipe: RingdatePipe;

  beforeEach(() => {
    pipe = new RingdatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the formatted date when a valid date is passed', () => {
    const testDate = new Date('2024-12-15T10:30:00');
    const result = pipe.transform(testDate);
    expect(result).toBe('10:30 - 15/12/2024');
  });

  it('should return the current date when undefined is passed', () => {
    const now = new Date();
    const result = pipe.transform(undefined);
    const formattedNow = `${pipe.padZero(now.getHours())}:${pipe.padZero(now.getMinutes())} - ${pipe.padZero(now.getDate())}/${pipe.padZero(now.getMonth() + 1)}/${now.getFullYear()}`;
    expect(result).toBe(formattedNow);
  });

  it('should pad single-digit day, month, hours, and minutes with zero', () => {
    const testDate = new Date('2024-12-01T09:05:00');
    const result = pipe.transform(testDate);
    expect(result).toBe('09:05 - 01/12/2024');
  });
});
