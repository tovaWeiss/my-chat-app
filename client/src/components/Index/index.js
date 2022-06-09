import React from "react";

const IndexPage = () => {
    React.useEffect(() => {
        const token = localStorage.getItem("chat-app-token");
        if (!token) {
            window.location.href = '/login';
        } else {
            window.location.href = '/dashboard';
        }
    }, [0]);
    return <div></div>;
};

export default IndexPage;