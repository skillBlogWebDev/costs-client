import { MutableRefObject, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthClient } from '../../api/authClient';
import { Spinner } from '../Spinner/Spinner';
import { handleAlertMessage } from '../../utils/auth';
import './styles.css';

export const AuthPage = ({ type }: { type: 'login' | 'registration' }) => {
    const [spinner, setSpinner] = useState(false);
    const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
    const navigate = useNavigate();
    const currentAuthTitle = type === 'login' ? 'Войти' : 'Регистрация';

    const handleAuthResponse = (
        result: boolean | undefined,
        navigatePath: string,
        alertText: string
    ) => {
        if (!result) {
            setSpinner(false);
            return;
        }

        setSpinner(false);
        navigate(navigatePath);
        handleAlertMessage({ alertText, alertStatus: 'success' });
    }

    const handleLogin = async (username: string, password: string) => {
        if (!username || !password) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Заполните все поля', alertStatus: 'warning' });
            return;
        }

        const result = await AuthClient.login(username, password);

        handleAuthResponse(result, '/costs', 'Вход выполнен');
    }


    const handleRegistration = async (username: string, password: string) => {
        if (!username || !password) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Заполните все поля', alertStatus: 'warning' });
            return;
        }


        if (password.length < 4) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Пароль должен содержать больше 4 символов', alertStatus: 'warning' });
            return;
        }

        const result = await AuthClient.registration(username, password);

        handleAuthResponse(result, '/login', 'Регистрация выполнена');
    }

    const handleAuth = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSpinner(true);

        switch (type) {
            case 'login':
                handleLogin(usernameRef.current.value, passwordRef.current.value);
                break;
            case 'registration':
                handleRegistration(usernameRef.current.value, passwordRef.current.value);
                break;
            default:
                break;
        }
    }

    return (
        <div className='container'>
            <h1>{currentAuthTitle}</h1>
            <form onSubmit={handleAuth} className='form-group'>
                <label className='auth-label'>
                    Введите имя пользователя
                    <input ref={usernameRef} type="text" className='form-control'/>
                </label>
                <label className='auth-label'>
                    Введите  пароль
                    <input ref={passwordRef} type="password" className='form-control' />
                </label>
                <button className='btn btn-primary auth-btn'>
                    {spinner ? <Spinner top={5} left={20}/> : currentAuthTitle}
                </button>
            </form>
            {type === 'login'
            ? <div>
                <span className='question_text'>Еще нет аккаунта?</span>
                <Link to={'/registration'}>Зрегестрироваться</Link>
            </div>
            : <div>
                <span className='question_text'>Уже есть аккаунт?</span>
                <Link to={'/login'}>Войти</Link>
            </div>
            }
        </div>
    );
}