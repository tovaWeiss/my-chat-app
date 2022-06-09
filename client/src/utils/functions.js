const checkAuth = () => {
    if (localStorage.getItem("chat-app-token"))
        return;
    window.location.href = '/login';
}

module.exports = {
    checkAuth
}