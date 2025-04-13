// scripts/footer.js
"use strict";

export async function LoadFooter() {
    try {
        const footerElement = document.querySelector("footer");
        if (!footerElement) {
            console.error("Footer element not found in DOM");
            return;
        }

        const response = await fetch("./views/components/footer.html");
        footerElement.innerHTML = await response.text();
    } catch (error) {
        console.error("Footer loading failed:", error);
    }
}