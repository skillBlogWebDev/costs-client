import { setTotalPrice } from '../context/index';
import { ICost } from '../types';

export const countTotalPrice = (costs: ICost[]) => {
    if (costs === undefined) return;
    setTotalPrice(
        costs.reduce((defaultCount, item) => defaultCount + item.price, 0)
    );
}

export const formatDate = (date: string) => {
    const newDate = new Date(date);

    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };

    return newDate.toLocaleString('ru', options as Intl.DateTimeFormatOptions);
}