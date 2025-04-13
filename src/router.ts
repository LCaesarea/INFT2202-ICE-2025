import { LoadHeader, updateActiveNavLink } from "./header";
import { AuthGuard, SessionExpiry } from "./authguard";

interface RouteConfig {
    [key: string]: {
        page: string;
        display?: () => void;
        content?: string;
    };
}

export class Router {
    private routes: RouteConfig;
    private mainContent: HTMLElement;
    private authGuard: () => boolean;
    private sessionExpiry: () => void;

    constructor(routes: RouteConfig) {
        this.routes = routes;
        this.mainContent = document.getElementById("mainContent") as HTMLElement;
        this.authGuard = AuthGuard(this);
        // @ts-ignore
        this.sessionExpiry = SessionExpiry(this);
    }

    async init(): Promise<void> {
        window.addEventListener("hashchange", () => this.loadRoute());
        await this.loadRoute();
    }

    private async loadRoute(): Promise<void> {
        const path = window.location.hash.substring(1) || "/";
        const route = this.routes[path] || this.routes["404"];

        if (!this.authGuard()) return;

        await LoadHeader();
        this.mainContent.innerHTML = await this.fetchPageContent(route.page);
        if (route.display) route.display();
        updateActiveNavLink();
    }

    private async fetchPageContent(pagePath: string): Promise<string> {
        try {
            const response = await fetch(`./views/pages/${pagePath}`);
            return await response.text();
        } catch {
            return this.routes["404"].content || "";
        }
    }

    navigate(path: string): void {
        window.location.hash = path;
    }
}