import { Router } from "./router";

export function AuthGuard(router: Router): () => boolean {
    const protectedRoutes = ["/contact-list", "/edit"];

    return (): boolean => {
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

// src/authguard.ts
export function SessionExpiry(router: Router): void {
    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            sessionStorage.removeItem("user");
            router.navigate("/login");
        }, 900000); // 15 minutes
    };

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    resetTimer();
}