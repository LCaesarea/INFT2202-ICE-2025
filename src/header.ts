import { Router } from "./router";
import { routes } from "./app";

export async function LoadHeader(): Promise<void> {
    try {
        const response = await fetch("./views/components/header.html");
        const header = document.querySelector("header") as HTMLElement;
        header.innerHTML = await response.text();
        updateActiveNavLink();
        setupNavEventListeners();
        CheckLogin();
    } catch (error) {
        console.error("Header loading failed:", error);
    }
}

export function CheckLogin(): void {
    const loginLink = document.querySelector<HTMLAnchorElement>('a[href="#/login"]');
    const user = sessionStorage.getItem("user");

    if (user && loginLink) {
        loginLink.innerHTML = `<a href="#" id="logout" class="nav-link">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>`;
        const logoutBtn = document.getElementById("logout") as HTMLElement;
        logoutBtn.addEventListener("click", handleLogout);
    }
}

export function handleLogout(): void {
    sessionStorage.removeItem("user");
    const router = new Router(routes);
    router.navigate("/login");
}

export function updateActiveNavLink(): void {
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".nav-link");
    const currentHash = window.location.hash.substring(1) || "/";

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        const linkPath = href ? href.substring(1) : "";
        link.classList.toggle("active", linkPath === currentHash);
        // @ts-ignore
        link.setAttribute("aria-current", linkPath === currentHash ? "page" : null);
    });
}

function setupNavEventListeners(): void {
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function(this: HTMLAnchorElement, event: Event) {
            event.preventDefault();
            if (this.hash) {
                // Fix: Handle null case with empty string fallback
                window.location.hash = this.hash ?? '';
            }
        });
    });
}