import React from 'react';
import Styles from './Login.module.sass'
// import { createUseStyles, useTheme } from "react-jss";
// import { ICustomTheme } from 'src/bootstrap';

// const useStyles = createUseStyles({
//     header_text: {
//         color: ({ theme }: { theme: ICustomTheme }) => theme.bittersweet
//     }
// })

const Login = () => {
    // const theme: any = useTheme()
    // const classes: any = useStyles({ theme });
    return <div>
        <h1 className={Styles.header_text}>
            Hello world!
        </h1>
    </div>
}

export default Login