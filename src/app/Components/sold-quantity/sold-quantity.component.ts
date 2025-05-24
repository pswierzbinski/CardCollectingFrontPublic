import { Component, inject, Input } from '@angular/core';
import { TuiDay, TuiDayLike, TuiDayRange, TuiMonth, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TUI_MONTHS } from '@taiga-ui/core';
import { map, Observable } from 'rxjs';
import { chartMarketItem } from '../../Classes/chartMarketItem';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiAxes, TuiLineDaysChart } from '@taiga-ui/addon-charts';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';

@Component({
    selector: 'app-sold-quantity',
    imports: [AsyncPipe, FormsModule, NgIf, TuiAxes, TuiInputDateRangeModule, TuiLineDaysChart],
    templateUrl: './sold-quantity.component.html',
    styleUrl: './sold-quantity.component.less'
})
export class SoldQuantityComponent {
    @Input() marketInfoForChart: chartMarketItem[] = [];
    private readonly months$ = inject(TUI_MONTHS);
    protected range = new TuiDayRange(
        TuiDay.currentLocal().append({ month: -1 }),
        TuiDay.currentLocal(),
    );
    ngOnInit() {

    }
    protected readonly maxLength: TuiDayLike = { month: 12 };

    protected readonly xStringify$: Observable<TuiStringHandler<TuiDay>> =
        this.months$.pipe(
            map(
                (months) =>
                    ({ month, day }) =>
                        `${months[month]}, ${day}`,
            ),
        );

    protected get value(): ReadonlyArray<[TuiDay, number]> {
        return this.computeValue(this.range);

    }

    @tuiPure
    protected computeLabels$({
        from,
        to,
    }: TuiDayRange): Observable<ReadonlyArray<string | null>> {
        return this.months$.pipe(
            map((months) => [
                ...Array.from(
                    { length: TuiMonth.lengthBetween(from, to) + 1 },
                    (_, i) => months[from.append({ month: i }).month] ?? '',
                ),
                null,
            ]),
        );
    }

    protected readonly yStringify: TuiStringHandler<number> = (y) =>
        `Sold: ${(y).toLocaleString('pl-PL', { minimumFractionDigits: 0 })}`;

    @tuiPure
    private computeValue({ from, to }: TuiDayRange): ReadonlyArray<[TuiDay, number]> {
        return new Array(TuiDay.lengthBetween(from, to) + 1).fill(0).map((_, i) => {
            const date = from.append({ day: i });
            let totalQuantity = 0;
            for (let i = 0; i < this.marketInfoForChart.length; i++) {
                if (this.marketInfoForChart[i].dateClosed.getMonth() == date.month && this.marketInfoForChart[i].dateClosed.getFullYear() == date.year && this.marketInfoForChart[i].dateClosed.getDate() == date.day) {
                    totalQuantity += this.marketInfoForChart[i].quantity;
                }
            }
            return [date, totalQuantity];
        }
        );
    }
}
