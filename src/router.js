import { LoadHeader, updateActiveNavLink } from "./header";
import { AuthGuard, SessionExpiry } from "./authguard";
export class Router {
    routes;
    mainContent;
    authGuard;
    sessionExpiry;
    constructor(routes) {
        this.routes = routes;
        this.mainContent = document.getElementById("mainContent");
        this.authGuard = AuthGuard(this);
        // @ts-ignore
        this.sessionExpiry = SessionExpiry(this);
    }
    async init() {
        window.addEventListener("hashchange", () => this.loadRoute());
        await this.loadRoute();
    }
    async loadRoute() {
        const path = window.location.hash.substring(1) || "/";
        const route = this.routes[path] || this.routes["404"];
        if (!this.authGuard())
            return;
        await LoadHeader();
        this.mainContent.innerHTML = await this.fetchPageContent(route.page);
        if (route.display)
            route.display();
        updateActiveNavLink();
    }
    async fetchPageContent(pagePath) {
        try {
            const response = await fetch(`./views/pages/${pagePath}`);
            return await response.text();
        }
        catch {
            return this.routes["404"].content || "";
        }
    }
    navigate(path) {
        window.location.hash = path;
    }
}
//# sourceMappingURL=router.js.map