// scripts/header.js
"use strict";

export async function LoadHeader() {
    try {
        const response = await fetch("./views/components/header.html");
        const headerHTML = await response.text();
        document.querySelector("header").innerHTML = headerHTML;
        updateActiveNavLink();
        setupNavEventListeners();
        CheckLogin(); // Moved auth check here
    } catch (error) {
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
        document.getElementById("logout").addEventListener("click", handleLogout);
    }
}

export function handleLogout() {
    sessionStorage.removeItem("user");
    router.navigate("/login");
}

export function updateActiveNavLink() {
    const navLinks = document.querySelectorAll(".nav-link");
    const currentHash = window.location.hash.substring(1) || "/";

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href").substring(1);
        link.classList.toggle("active", linkPath === currentHash);
        link.setAttribute("aria-current", linkPath === currentHash ? "page" : null);
    });
}

function setupNavEventListeners() {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            if (!this.hash) return;
            event.preventDefault();
            window.location.hash = this.hash;
        });
    });
}