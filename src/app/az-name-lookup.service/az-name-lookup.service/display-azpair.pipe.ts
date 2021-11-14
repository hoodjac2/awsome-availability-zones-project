import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayAZPair' })
export class DisplayAZPairPipe implements PipeTransform{
  transform(AZPair: string): string{
    const array = AZPair.split(',');
    return array[0] + ' => ' + array[1];
  }
}
