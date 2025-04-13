"use strict";

export function AuthGuard(router) { // Accept router as parameter
    const protectedRoutes = ["/contact-list", "/edit"];

    return function() {
        const path = window.location.hash.substring(1);
        if (protectedRoutes.includes(path)) {
            if (!sessionStorage.getItem("user")) {
                router.navigate("/login");
                return false;
            }
        }
        return true;
    }
}

export function SessionExpiry(router) { // Accept router as parameter
    let timeout;

    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(() => logout(router), 15 * 60 * 1000);
    }

    function logout(router) {
        sessionStorage.removeItem("user");
        router.navigate("/login");
        alert("Session expired. Please login again.");
    }

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    resetTimer();
}