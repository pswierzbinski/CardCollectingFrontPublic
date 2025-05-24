import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../Classes/card';

@Pipe({
  name: 'sortName',
  standalone: true
})
export class SortNamePipe implements PipeTransform {

  transform(cards: Card[], sort: string): Card[] {
    if (sort == 'name')
      cards.sort((a, b) => a.name.localeCompare(b.name, 'pl', { caseFirst: 'upper' }));
    else if (sort == 'nameDesc')
      cards.sort((a, b) => -1 * a.name.localeCompare(b.name, 'pl', { caseFirst: 'lower' }));
    else if (sort == 'id')
      cards = cards.sort(({ id: a }, { id: b }) => a - b);
    else if (sort == 'idDesc')
      cards = cards.sort(({ id: a }, { id: b }) => b - a);
    return cards;
  }

}
