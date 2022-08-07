import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { ICostsHeaderProps } from "../../../types";
import { Spinner } from "../../Spinner/Spinner";
import { countTotalPrice } from '../../../utils/arrayUtils';
import { useStore } from 'effector-react';
import { $totalPrice } from "../../../context";
import './styles.css'
import { validationInputs } from '../../../utils/validation';
import { getAuthDataFromLS, handleAlertMessage } from '../../../utils/auth';
import { createCostFx } from '../../../api/costsClient';
import { createCost } from '../../../context/index';

export const Header = ({ costs }: ICostsHeaderProps) => {
    const [spinner, setSpinner] = useState(false);
    const textRef = useRef() as MutableRefObject<HTMLInputElement>;
    const priceRef = useRef() as MutableRefObject<HTMLInputElement>;
    const dateRef = useRef() as MutableRefObject<HTMLInputElement>;
    const totalPrice = useStore($totalPrice);

    useEffect(() => {
        countTotalPrice(costs);
    }, [costs])

    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSpinner(true);

        const textInputValue = textRef.current.value;
        const priceInputValue = priceRef.current.value;
        const dateInputValue = dateRef.current.value; 

        if (!validationInputs(
            textRef,
            priceRef,
            dateRef
        )) {
            setSpinner(false);
            return;
        }

        const authData = getAuthDataFromLS();

        const cost = await createCostFx({
            url: '/cost',
            cost: {
                text: textInputValue,
                price: parseInt(priceInputValue),
                date: dateInputValue
            },
            token: authData.access_token
        });

        if (!cost) {
            setSpinner(false);
            return;
        }

        setSpinner(false);
        createCost(cost);
        handleAlertMessage({ alertText: 'Успешно создано', alertStatus: 'success' });
    }

    return (
        <div className="costs-header">
            <form className="d-flex mb-3" onSubmit={formSubmit}>
                <div className="form-item">
                    <span className="mb-3">Куда было потрачено:</span>
                    <input ref={textRef} type="text" className="form-control" />
                </div>
                <div className="form-item">
                    <span className="mb-3">Сколько было потрачено:</span>
                    <input ref={priceRef} type="text" className="form-control" />
                </div>
                <div className="form-item">
                    <span className="mb-3">Когда было потрачено:</span>
                    <input ref={dateRef} type="date" className="form-control" />
                </div>
                <button className='btn btn-primary add-btn'>
                    {spinner ? <Spinner top={5} left={20}/> : 'Добавить'}
                </button>
            </form>
            <div style={{ textAlign: 'end', marginBottom: 10 }}>
                Итого:
                <span> {isNaN(parseInt(String(totalPrice))) ? 0 : parseInt(String(totalPrice))}</span>
                р.
            </div>
        </div>
    );
}