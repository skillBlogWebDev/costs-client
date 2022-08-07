import { createDomain } from 'effector';
import { ICost } from '../types/index';

const costs = createDomain();

export const setCosts = costs.createEvent<ICost[]>();
export const createCost = costs.createEvent<ICost>();
export const updatedCost = costs.createEvent<ICost>();
export const removeCost = costs.createEvent<string | number>();
export const setTotalPrice = costs.createEvent<number>();

const handleRemoveCost = (costs: ICost[], id: string | number) => 
    costs.filter(cost => cost._id !== id);

const handleUpdateCost = (
    costs: ICost[],
    id: string | number,
    payload: Partial<ICost>
) => costs.map(cost => {
    if(cost._id === id) {
        return {
            ...cost,
            ...payload
        }
    }

    return cost;
})

export const $costs = costs.createStore<ICost[]>([])
    .on(createCost, (state, cost) => [...state, cost])
    .on(setCosts, (_, costs) => costs)
    .on(removeCost, (state, id) => [...handleRemoveCost(state, id)])
    .on(updatedCost, (state, cost) => [
        ...handleUpdateCost(
            state,
            cost._id as string,
            {
                text: cost.text,
                price: cost.price,
                date: cost.date
            }
        )
    ]);

export const $totalPrice = costs.createStore<number>(0)
    .on(setTotalPrice, (_, value) => value);