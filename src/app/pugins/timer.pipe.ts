import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer',
  pure: false,
})
export class TimerPipe implements PipeTransform {
  transform(value: number | null, minus = true): string {
    const process = Math.abs(Math.floor(value ?? 0) / 1000);
    const date: string[] = [];

    date.push(Math.floor(process / 3600).toFixed(0));
    date.push(
      Math.floor((process % 3600) / 60)
        .toFixed(0)
        .padStart(2, '0')
    );
    date.push(
      Math.floor((process % 3600) % 60)
        .toFixed(0)
        .padStart(2, '0')
    );

    if ((value ?? 0) < 0)
      return minus ? `0:00:00 (-${date.join(':')})` : `0:00:00`;
    return date.join(':');
  }
}
