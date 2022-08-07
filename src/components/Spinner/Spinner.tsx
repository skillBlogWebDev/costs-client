import { ISpinnerProps } from "../../types";
import './styles.css';

export const Spinner = ({ top, left }: ISpinnerProps) => (
    <div
        style={{ top: `${top}px`, left: `${left}px` }}
        className='spinner-border main-spinner' role='status'
    />
)