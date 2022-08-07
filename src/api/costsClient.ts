import { createEffect } from "effector";
import { IBaseEffectArgs, ICreateCost, IDeleteCost, IRefreshToken, IUpdateCost } from "../types";
import api from './axiosClient';
import { removeUser } from '../utils/auth';
import { handleAxiosError } from '../utils/errors';

export const createCostFx = createEffect(async ({ url, cost, token }: ICreateCost) => {
    try {
        const { data } = await api.post(url, { ...cost }, { headers: { 'Authorization': `Bearer ${token}` } });

        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'create', createCost: { cost } }); 
    }
});

export const updateCostFx = createEffect(async ({ url, cost, token, id }: IUpdateCost) => {
    try {
        const { data } = await api.patch(`${url}/${id}`, { ...cost }, { headers: { 'Authorization': `Bearer ${token}` } });

        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'update', updateCost: { cost, id } }); 
    }
});

export const getCostsFx = createEffect(async ({ url, token }: IBaseEffectArgs) => {
    try {
        const { data } = await api.get(url, { headers: { 'Authorization': `Bearer ${token}` } });

        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'get' });
    }
});

export const deleteCostFx = createEffect(async ({ url, token, id }: IDeleteCost) => {
    try {
        await api.delete(`${url}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
    } catch (error) {
        handleAxiosError(error, { type: 'delete', deleteCost: { id } });
    }
});

export const refreshTokenFx = createEffect(async ({ url, token, username }: IRefreshToken) => {
    try {
        const result = await api.post(url, { refresh_token: token, username });

        if (result.status === 200) {
            localStorage.setItem('auth', JSON.stringify({
                ...result.data,
                username
            }));

            return result.data.access_token;
        } else {
            removeUser();
        }
    } catch (error) {
        
    }
});
