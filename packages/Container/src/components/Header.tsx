import React from 'react';
import TopNavigation from "singleSignOn/TopNavigation"

const Header = ({ isSidebar }: { isSidebar: boolean }) => {
    return <TopNavigation isSidebar={isSidebar} />
}

export default Header