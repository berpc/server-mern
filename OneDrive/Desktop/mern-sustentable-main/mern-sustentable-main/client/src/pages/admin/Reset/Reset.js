import React, { useState, useEffect } from "react";
import { useLocation} from 'react-router-dom';
import { Layout } from "antd"; //Tabs
import Logo from '../../../assets/img/png/resto.png';
import { User } from "../../../api/user";
import ResetPasswordForm from '../../../components/Admin/ResetPasswordForm';
//import Error404 from '../../Error404';
import './Reset.scss';

const userController = new User();


export default function Reset(props) {
    const { Content } = Layout;

    const [userByToken, setUserByToken] = useState([]);
    const [isValid, setIsValid] = useState(false);

    const urlparams = useLocation().pathname.split("/").filter((ítem)=> ítem)

    useEffect(() => {
        if(!isValid){
            userController.getUserByResetTokenApi(urlparams[1]).then(response => {
                setUserByToken(response.user);
            });
        setIsValid(true);
        }
    }, [userByToken]);


    //TO DO: if (!userByToken) return pag 404 o algo asi
    if (userByToken === undefined){
        return (
            <Layout className="reset-form">
            <Content className="reset-form__content">
                <h1 className="reset-form__content-logo">
                    <img src={Logo} alt="LALALALALA" />
                </h1>
                <div className="reset-form__content-error">
                    El tiempo de restablecimiento de contraseña ha caducado
                    o el token es inválido
                </div>
            </Content>
        </Layout>

            //<Error404 className="reset-form"> </Error404>
        );
    } else {
        return (
            <Layout className="reset-form">
                <Content className="reset-form__content">
                    <h1 className="reset-form__content-logo">
                        <img src={Logo} alt="LALALALALA" />
                    </h1>
                    <div className="reset-form__content-error">
                        <h2>
                            Restablezca su contraseña
                        </h2>
                    </div>
                    <span>
                        <ResetPasswordForm userByToken={userByToken} />
                    </span>
                    <br></br>
                    <div className="reset-form__content-error">
                        <h5>
                            Si no quiere restablecer la contraseña cierre esta pestaña
                        </h5>
                    </div>
                </Content>
            </Layout>
        );
    }
}
