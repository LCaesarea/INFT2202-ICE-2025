export function AuthGuard(router) {
    const protectedRoutes = ["/contact-list", "/edit"];
    return () => {
        const path = window.location.hash.substring(1);
        if (protectedRoutes.includes(path)) {
            if (!sessionStorage.getItem("user")) {
                router.navigate("/login");
                return false;
            }
        }
        return true;
    };
}
export function SessionExpiry(router) {
    let timeout;
    const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            sessionStorage.removeItem("user");
            router.navigate("/login");
            alert("Session expired. Please login again.");
        }, 900000); // 15 minutes
    };
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    resetTimer();
}
//# sourceMappingURL=authguard.js.map