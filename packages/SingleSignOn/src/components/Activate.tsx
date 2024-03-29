import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { axiosCustom } from "../helpers/util"
import Styles from './Login.module.sass';

const Activate = ({ location }: any) => {

    const [activationStatus, setActivationStatus] = useState('Activating...')
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear()
        const params = new URLSearchParams(location.search);
        const id = params.get('id')
        const loginKey = params.get('loginKey')
        activateUser(id, loginKey)
    }, [])

    const activateUser = async (id: any, loginKey: any) => {
        const response: any = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMPLIANCE_SEARCH_URL}/activateme?id=${id}&loginKey=${loginKey}`)
        if (response.data.validation) {
            // user verified successfully
            setActivationStatus(`${response.data.message}, redirecting to password set page`)
            setTimeout(() => {
                navigate({
                    pathname: `/set_password`,
                    search: `pId=${response.data.response.principleId}&loginKey=${response.data.response.loginKey}`,
                })
            }, 2000)
        } else {
            setActivationStatus(response.data.message)
            // user verification failed
        }
    }

    return (
        <div className={Styles.login}>
            <div className={`${Styles.login_container}`} style={{ textAlign: 'center' }}>
                {activationStatus}
            </div>
        </div>)

}

export default Activate