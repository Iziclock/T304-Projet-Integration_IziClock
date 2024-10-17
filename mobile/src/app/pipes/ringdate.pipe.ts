import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ringdate',
  standalone: true
})
export class RingdatePipe implements PipeTransform {

  transform(date: Date | undefined): string {
    if (!date) date = new Date();

    let day = this.padZero(date.getDate());
    let month = this.padZero(date.getMonth() + 1); // Mois de 0 à 11
    let year = date.getFullYear();

    let hours = this.padZero(date.getHours());
    let minutes = this.padZero(date.getMinutes());

   console.log(minutes)

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  }

  padZero(n: number): string { // Ajoute un zéro devant un chiffre si celui-ci est inférieur à 10
    return n < 10 ? '0' + n : '' + n;
  }

}
