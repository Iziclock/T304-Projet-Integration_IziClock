import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true
})
export class TimePipe implements PipeTransform {

  transform(seconds: number): string {
    if (seconds < 60 * 60) {
      // Less than 1 hour: display in "00min" format
      const minutes = Math.floor(seconds / 60);
      return `${this.pad(minutes)}min`;
    } else {
      // 1 hour or more: display in "00h00" format
      const hours: number = Math.floor(seconds / 3600);
      const minutes: number = Math.floor((seconds % 3600) / 60);
      return `${this.pad(hours)}h${this.pad(minutes)}`;
    }
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
