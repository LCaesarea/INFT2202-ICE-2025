// src/app.ts
import { Router } from "./router";
import { LoadFooter } from "./footer";
import { CheckLogin } from "./header";
import { Contact } from "./namespace";
import { User } from "./user";
import { storage, handleCancelClick, AddContact } from "./utils";

interface RouteConfig {
    [key: string]: {
        page: string;
        display?: () => void;
        content?: string;
    };
}

interface WeatherData {
    main: {
        temp: number;
    };
    weather: [{
        description: string;
    }];
}

interface UserData {
    users: {
        Username: string;
        Password: string;
        DisplayName: string;
        EmailAddress: string;
    }[];
}

export const routes: RouteConfig = {
    "/": {
        page: "home.html",
        display: DisplayHomePage
    },
    "/about": {
        page: "about.html"
    },
    "/products": {
        page: "products.html"
    },
    "/services": {
        page: "services.html"
    },
    "/contact": {
        page: "contact.html",
        display: DisplayContactPage
    },
    "/login": {
        page: "login.html",
        display: DisplayLoginPage
    },
    "/register": {
        page: "register.html",
        display: DisplayRegisterPage
    },
    "/contact-list": {
        page: "contact-list.html",
        display: DisplayContactListPage
    },
    "/edit": {
        page: "edit.html",
        display: DisplayEditPage
    },
    "404": {
        page: "404.html",
        content: `<main class="container mt-4"><h1>404 - Page Not Found</h1></main>`
    }
};

const router = new Router(routes);

// ================== START FUNCTION ==================
async function Start(): Promise<void> {
    console.log("App Started!");
    await LoadFooter();
    await router.init();
    CheckLogin();
}

// ================== PAGE FUNCTIONS ==================
function DisplayHomePage(): void {
    const aboutButton = document.getElementById("AboutUsBtn") as HTMLButtonElement | null;
    aboutButton?.addEventListener("click", () => {
        router.navigate("/about");
    });

    DisplayWeather();
}

function DisplayWeather(): void {
    const API_KEY = "f66ff82f9f2096371ad62f5ffaf8121f";
    const city = "Oshawa";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then((response: Response) => response.json())
        .then((data: WeatherData) => {
            if (data.main && data.weather?.[0]) {
                const weatherHTML = `
                    <div class="mt-4">
                        <h3>Weather in ${city}</h3>
                        <p>Temperature: ${data.main.temp}°C</p>
                        <p>Condition: ${data.weather[0].description}</p>
                    </div>`;
                const mainContent = document.getElementById("mainContent");
                mainContent?.insertAdjacentHTML("beforeend", weatherHTML);
            }
        })
        .catch(console.error);
}

function DisplayContactPage(): void {
    console.log("Contact page loaded");

    const sendButton = document.getElementById("sendButton") as HTMLButtonElement | null;
    const subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement | null;
    const contactForm = document.getElementById("contactForm") as HTMLFormElement | null;

    sendButton?.addEventListener("click", (event: Event) => {
        event.preventDefault();
        console.log("Send button clicked");

        if (subscribeCheckbox?.checked) {
            console.log("Checkbox is checked");

            const fullName = (document.getElementById("fullName") as HTMLInputElement).value.trim();
            const contactNumber = (document.getElementById("contactNumber") as HTMLInputElement).value.trim();
            const emailAddress = (document.getElementById("emailAddress") as HTMLInputElement).value.trim();

            if (!fullName || !contactNumber || !emailAddress) {
                alert("Please fill in all required fields!");
                return;
            }

            try {
                const contact = new Contact(fullName, contactNumber, emailAddress);
                const serialized = contact.serialize();

                if (serialized && contactForm) {
                    const storageKey = `contact_${fullName.substring(0, 1)}_${Date.now()}`;
                    storage.save(storageKey, serialized);
                    console.log("Contact saved:", { storageKey, serialized });

                    contactForm.reset();
                    router.navigate("/contact-list");
                }
            } catch (error) {
                console.error("Error saving contact:", error);
                alert("An error occurred while saving your contact.");
            }
        } else {
            alert("Please check the subscribe box to save to contact list!");
        }
    });

    const contactListBtn = document.getElementById("contactListBtn") as HTMLButtonElement | null;
    contactListBtn?.addEventListener("click", () => {
        router.navigate("/contact-list");
    });
}

function DisplayContactListPage(): void {
    const addButton = document.getElementById("addButton") as HTMLButtonElement | null;
    addButton?.addEventListener("click", () => router.navigate("/edit"));

    if (localStorage.length) {
        let html = "";
        let index = 1;

        for (const key of Object.keys(localStorage)) {
            try {
                const contact = new Contact();
                const data = storage.get(key);

                if (data) {
                    contact.deserialize(data);
                    html += `
                        <tr>
                            <th scope="row">${index++}</th>
                            <td>${contact.fullName}</td>
                            <td>${contact.contactNumber}</td>
                            <td>${contact.emailAddress}</td>
                            <td class="text-center">
                                <button value="${key}" class="btn btn-primary btn-sm edit">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </td>
                            <td class="text-center">
                                <button value="${key}" class="btn btn-danger btn-sm delete">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </button>
                            </td>
                        </tr>`;
                }
            } catch (error) {
                console.error("Error processing contact:", key, error);
                storage.remove(key);
            }
        }

        const contactList = document.getElementById("contactList") as HTMLElement | null;
        if (contactList) contactList.innerHTML = html;

        document.querySelectorAll(".edit").forEach(btn => {
            btn.addEventListener("click", function(this: HTMLButtonElement) {
                router.navigate(`/edit#${this.value}`);
            });
        });

        document.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", function(this: HTMLButtonElement) {
                if (confirm("Delete this contact?")) {
                    storage.remove(this.value);
                    window.location.reload();
                }
            });
        });
    }
}

function DisplayEditPage(): void {
    const page = location.hash.substring(1);
    const editButton = document.getElementById("editButton") as HTMLButtonElement | null;

    if (page === "add") {
        const heading = document.querySelector("h1");
        if (heading) heading.textContent = "Add Contact";
        if (editButton) editButton.innerHTML = `<i class="fas fa-plus-circle"></i> Add`;
    } else {
        const contact = new Contact();
        const data = storage.get(page);
        if (data) {
            contact.deserialize(data);
            (document.getElementById("fullName") as HTMLInputElement).value = contact.fullName;
            (document.getElementById("contactNumber") as HTMLInputElement).value = contact.contactNumber;
            (document.getElementById("emailAddress") as HTMLInputElement).value = contact.emailAddress;
        }
    }

    editButton?.addEventListener("click", (event: Event) => {
        event.preventDefault();
        const contact = new Contact(
            (document.getElementById("fullName") as HTMLInputElement).value,
            (document.getElementById("contactNumber") as HTMLInputElement).value,
            (document.getElementById("emailAddress") as HTMLInputElement).value
        );

        if (contact.serialize()) {
            AddContact(router, contact);
        }
    });
}

// ================== LOGIN/LOGOUT FUNCTIONS ==================
function DisplayLoginPage(): void {
    const messageArea = document.getElementById("messageArea") as HTMLElement | null;
    if (messageArea) messageArea.style.display = "none";

    // Fetch users from server endpoint
    fetch("http://localhost:3000/users")
        .then((response: Response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data: UserData) => {
            const loginButton = document.getElementById("loginButton") as HTMLButtonElement | null;
            loginButton?.addEventListener("click", () => {
                const username = (document.getElementById("username") as HTMLInputElement).value;
                const password = (document.getElementById("password") as HTMLInputElement).value;
                let validUser = false;

                data.users.forEach(user => {
                    if (user.Username === username && user.Password === password) {
                        validUser = true;
                        const sessionUser = new User(
                            user.DisplayName,
                            user.EmailAddress,
                            user.Username
                        );
                        sessionStorage.setItem("user", sessionUser.serialize());
                    }
                });

                if (validUser) {
                    router.navigate("/contact-list");
                } else if (messageArea) {
                    messageArea.textContent = "Invalid username or password!";
                    messageArea.classList.add("alert-danger");
                    messageArea.style.display = "block";
                    (document.getElementById("username") as HTMLInputElement).focus();
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            if (messageArea) {
                messageArea.textContent = "Failed to connect to server. Please try again later.";
                messageArea.classList.add("alert-danger");
                messageArea.style.display = "block";
            }
        });

    const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement | null;
    cancelButton?.addEventListener("click", (event: Event) => {
        handleCancelClick(router, event);
    });
}

function DisplayRegisterPage(): void {
    // Registration logic remains unchanged
}

window.addEventListener("load", Start);