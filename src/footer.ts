// src/footer.ts
export async function LoadFooter(): Promise<void> {
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