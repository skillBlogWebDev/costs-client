import { useEffect, useState, useRef, useMemo } from 'react';
import { Spinner } from "../Spinner/Spinner";
import { Header } from "./Header/Header"
import { getAuthDataFromLS } from '../../utils/auth';
import { getCostsFx } from "../../api/costsClient";
import { $costs, setCosts } from '../../context/index';
import { useStore } from "effector-react";
import { CostsList } from './CostsList/CostsList';

export const CostsPage = () => {
    const [spinner, setSpinner] = useState(false);
    const store = useStore($costs);
    const shouldLoadCosts = useRef(true);

    useEffect(() => {
        if (shouldLoadCosts.current) {
            shouldLoadCosts.current = false;
            handleGetCosts();
            console.log(store);
        }
    }, [])

    const handleGetCosts = async () => {
        setSpinner(true);
        const authData = getAuthDataFromLS();        

        const costs = await getCostsFx({
            url: '/cost',
            token: authData.access_token
        });

        setSpinner(false);
        setCosts(costs);
    }

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Учет моих расходов</h2>
            {useMemo(() => <Header costs={store} />, [store])}
            <div style={{ position: 'relative' }}>
                {spinner && <Spinner top={0} left={0} />}
                {useMemo(() => <CostsList costs={store} />, [store])}
                {(!spinner && !store.length) && <h2>Список расходов пуст</h2>}
            </div>
        </div>
    )
}