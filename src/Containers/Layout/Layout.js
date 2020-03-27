import React, {Fragment} from 'react';

import TopNav from '../../Components/UI/TopNav/TopNav';

const Layout = (props) => {


    return (
        <Fragment>
            <TopNav/>


            {props.children}
        </Fragment>

    );



}

export default Layout;