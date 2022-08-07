import { ICostsItemProps } from "../../../types";
import { useState, useRef, MutableRefObject } from 'react';
import { getAuthDataFromLS, handleAlertMessage } from '../../../utils/auth';
import { deleteCostFx, updateCostFx } from '../../../api/costsClient';
import { removeCost, updatedCost } from '../../../context/index';
import { Spinner } from "../../Spinner/Spinner";
import { formatDate } from '../../../utils/arrayUtils';
import './styles.css';
import { validationInputs } from "../../../utils/validation";

export const CostsItem = ({ cost, index }: ICostsItemProps) => {
    const [edit, setEdit] = useState(false);
    const [deleteSpinner, setDeleteSpinner] = useState(false);
    const [editSpinner, setEditSpinner] = useState(false);
    const [newText, setNewText] = useState(cost.text);
    const [newPrice, setNewPrice] = useState<string | number>(cost.price);
    const [newDate, setNewDate] = useState(cost.date);
    const textRef = useRef() as MutableRefObject<HTMLInputElement>;
    const priceRef = useRef() as MutableRefObject<HTMLInputElement>;
    const dateRef = useRef() as MutableRefObject<HTMLInputElement>;

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => setNewText(event.target.value);
    const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => setNewPrice(event.target.value);
    const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => setNewDate(event.target.value);

    const allowEditCost = () => setEdit(true);

    const cancelEditCost = () => {
        setEditSpinner(false);
        setEdit(false)
    };

    const handleEditCost = async () => {
        setEditSpinner(true);

        if (
            newText === cost.text &&
            +newPrice === +cost.price &&
            newDate === cost.date
        ) {
            setEditSpinner(false);
            setEdit(false);
            return;
        }

        if (!validationInputs(
            textRef,
            priceRef,
            dateRef
        )) {
            setEditSpinner(false);
            return;
        }

        const authData = getAuthDataFromLS();

        const editedCost = await updateCostFx({
            url: '/cost',
            token: authData.access_token,
            cost: { text: newText, price: +newPrice, date: newDate },
            id: cost._id as string
        });

        if (!editedCost) {
            setEditSpinner(false);
            setEdit(false);
            return;
        }

        setEdit(false);
        setEditSpinner(false);
        updatedCost(editedCost);
        handleAlertMessage({ alertText: 'Успешно обновлено', alertStatus: 'success' });
    }

    const deleteCost = async () => {
        setDeleteSpinner(true);

        const authData = getAuthDataFromLS();

        await deleteCostFx({
            url: '/cost',
            token: authData.access_token,
            id: cost._id as string
        });

        setDeleteSpinner(false);
        removeCost(cost._id as string);
        handleAlertMessage({ alertText: 'Успешно удалено!', alertStatus: 'success' })
    }
    return (
        <li
            className="cost-item list-group-item d-flex justify-content-between align-items-center"
            id={cost._id as string}
        >
            <div className='cost-item-left'>
                <span>{index} Магазин</span>
                {edit
                ? <input
                    ref={textRef}
                    onChange={handleChangeText}
                    value={newText}
                    type='text'
                    className="form-control cost-item__shop-input"
                /> 
                : <span> "{cost.text}"</span>}
                {edit
                ? <input
                    ref={dateRef}
                    onChange={handleChangeDate}
                    value={new Date(newDate).toISOString().split('T')[0]}
                    type='date'
                    className="form-control cost-item__date-input"
                /> 
                : <span className='cost-date'>Дата {formatDate(cost.date as string)}</span>}
            </div>
            <div className='cost-item-right d-flex align-items-center'>
            {edit
                ? <input
                    ref={priceRef}
                    onChange={handleChangePrice}
                    value={newPrice}
                    type='text'
                    className="form-control cost-item__price-input"
                /> 
                : <span style={{ marginRight: '10px' }}>Сумма {cost.price}</span>}
            {edit
                ? <div className="btn-block__inner">
                    <button className="btn btn-success btn-save" onClick={handleEditCost}>
                        {editSpinner ? <Spinner top={5} left={38} /> : 'Сохранить'}
                    </button>
                    <button className="btn btn-danger btn-cancel" onClick={cancelEditCost}>
                        Отмена
                    </button>
                </div>
                : <button className="btn btn-primary btn-edit" onClick={allowEditCost}>
                    Изменить
                </button>}
                <button className="btn btn-danger btn-delete" onClick={deleteCost}>
                    {deleteSpinner ? <Spinner top={5} left={7} /> : <span>&times;</span>}
                </button>
            </div>
        </li>
    );
}