import { Router } from "./router";
import { routes } from "./app";
export async function LoadHeader() {
    try {
        const response = await fetch("./views/components/header.html");
        const header = document.querySelector("header");
        header.innerHTML = await response.text();
        updateActiveNavLink();
        setupNavEventListeners();
        CheckLogin();
    }
    catch (error) {
        console.error("Header loading failed:", error);
    }
}
export function CheckLogin() {
    const loginLink = document.querySelector('a[href="#/login"]');
    const user = sessionStorage.getItem("user");
    if (user && loginLink) {
        loginLink.innerHTML = `<a href="#" id="logout" class="nav-link">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>`;
        const logoutBtn = document.getElementById("logout");
        logoutBtn.addEventListener("click", handleLogout);
    }
}
export function handleLogout() {
    sessionStorage.removeItem("user");
    const router = new Router(routes);
    router.navigate("/login");
}
export function updateActiveNavLink() {
    const navLinks = document.querySelectorAll(".nav-link");
    const currentHash = window.location.hash.substring(1) || "/";
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        const linkPath = href ? href.substring(1) : "";
        link.classList.toggle("active", linkPath === currentHash);
        // @ts-ignore
        link.setAttribute("aria-current", linkPath === currentHash ? "page" : null);
    });
}
function setupNavEventListeners() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            if (this.hash) {
                // Fix: Handle null case with empty string fallback
                window.location.hash = this.hash ?? '';
            }
        });
    });
}
//# sourceMappingURL=header.js.map