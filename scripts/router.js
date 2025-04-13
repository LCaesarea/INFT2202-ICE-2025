// Update router.js
"use strict";
import { LoadHeader, updateActiveNavLink } from "./header.js";
import { AuthGuard, SessionExpiry } from "./authguard.js";

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.mainContent = document.getElementById("mainContent");
        this.authGuard = AuthGuard(this); // Pass router instance
        this.sessionExpiry = SessionExpiry(this); // Pass router instance
    }

    async init() {
        window.addEventListener("hashchange", () => this.loadRoute());
        await this.loadRoute();
    }

    async loadRoute() {
        const path = window.location.hash.substring(1) || "/";
        const route = this.routes[path] || this.routes["404"];

        if (!this.authGuard()) return;

        await LoadHeader();
        this.mainContent.innerHTML = await this.fetchPageContent(route.page);
        if (route.display) route.display();
        updateActiveNavLink();
    }

    async fetchPageContent(pagePath) {
        try {
            const response = await fetch(`./views/pages/${pagePath}`);
            return await response.text();
        } catch {
            return this.routes["404"].content;
        }
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleSessionExpiry() {
        return undefined;
    }
}