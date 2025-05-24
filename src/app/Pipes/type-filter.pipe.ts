import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../Classes/card';

@Pipe({
  name: 'typeFilter',
  standalone: true,
  pure: false
})
export class TypeFilterPipe implements PipeTransform {

  transform(cards: Card[], type: string[]): Card[] {
    if (type == undefined)
      return cards;
    else if (type.length == 0)
      return cards;
    var list: Card[] = [];
    console.log(type)
    list = cards.filter((elem: Card) => type.includes(elem.type));
    return list;
  }
}
