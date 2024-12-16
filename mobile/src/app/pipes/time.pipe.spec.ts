import { TimePipe } from './time.pipe';

describe('TimePipe', () => {
  let pipe: TimePipe;

  beforeEach(() => {
    pipe = new TimePipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform seconds to "00min" format when less than 1 hour', () => {
    const result = pipe.transform(120); 
    expect(result).toBe('02min');
  });

  it('should transform seconds to "00h00" format when 1 hour or more', () => {
    const result = pipe.transform(3661); 
    expect(result).toBe('01h01');
  });

  it('should pad minutes to "00min" format', () => {
    const result = pipe.transform(59); 
    expect(result).toBe('00min');
  });

  it('should correctly format 1 hour and 59 minutes', () => {
    const result = pipe.transform(7140); 
    expect(result).toBe('01h59');
  });

  it('should format exactly 1 hour correctly', () => {
    const result = pipe.transform(3600); 
    expect(result).toBe('01h00');
  });

  it('should handle 0 seconds correctly', () => {
    const result = pipe.transform(0);
    expect(result).toBe('00min');
  });

  it('should handle large values correctly', () => {
    const result = pipe.transform(10000); 
    expect(result).toBe('02h46');
  });
});
