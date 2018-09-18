((window, $, layer, SELF) => {
    const requestLogout = () => {
        return new window.Promise((resolve, reject) => {
            const xhr = new window.XMLHttpRequest();
            xhr.onloadstart = () => SELF.startLoadAnimation();
            xhr.onloadend = () => {
                SELF.stopLoadAnimation();
                resolve();
            };
            xhr.open("DELETE", "/admin/auth");
            xhr.send();
        });
    }, logout = () => {
        requestLogout().then(() => {
            window.location = "/";
        });
    };
    $("#admin-exit").click(() => {
        logout();
    });
})(this, $, layer, SELF);
