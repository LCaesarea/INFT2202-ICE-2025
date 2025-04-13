"use strict";
import { Router } from "./router.js";
import { LoadFooter } from "./footer.js";
// import { LoadHeader, updateActiveNavLink } from "./header.js";

// Route configuration
const routes = {
    "/": { page: "home.html", display: DisplayHomePage },
    "/about": { page: "about.html" },
    "/products": { page: "products.html" },
    "/services": { page: "services.html" },
    "/contact": { page: "contact.html", display: DisplayContactPage },
    "/login": { page: "login.html", display: DisplayLoginPage },
    "/register": { page: "register.html", display: DisplayRegisterPage },
    "/contact-list": { page: "contact-list.html", display: DisplayContactListPage },
    "/edit": { page: "edit.html", display: DisplayEditPage },
    "404": {
        page: "404.html",
        content: `<main class="container mt-4"><h1>404 - Page Not Found</h1></main>`
    }
};

const router = new Router(routes);

// ================== START FUNCTION ==================
async function Start() {
    console.log("App Started!");
    await LoadFooter();
    await router.init();
    CheckLogin();
}
// ================== AUTH FUNCTIONS ==================

// ================== PAGE FUNCTIONS ==================
function DisplayHomePage() {
    document.getElementById("AboutUsBtn")?.addEventListener("click", () => {
        router.navigate("/about");
    });

    DisplayWeather();
}

function DisplayWeather() {
    const API_KEY = "f66ff82f9f2096371ad62f5ffaf8121f";
    const city = "Oshawa";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.main && data.weather?.[0]) {
                const weatherHTML = `
                    <div class="mt-4">
                        <h3>Weather in ${city}</h3>
                        <p>Temperature: ${data.main.temp}°C</p>
                        <p>Condition: ${data.weather[0].description}</p>
                    </div>`;
                document.getElementById("mainContent").insertAdjacentHTML("beforeend", weatherHTML);
            }
        })
        .catch(console.error);
}

function DisplayContactPage() {
    console.log("Contact page loaded"); // Debug log

    const sendButton = document.getElementById("sendButton");
    const subscribeCheckbox = document.getElementById("subscribeCheckbox");
    const contactForm = document.getElementById("contactForm");

    sendButton?.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Send button clicked"); // Debug log

        if (subscribeCheckbox?.checked) {
            console.log("Checkbox is checked"); // Debug log

            const fullName = document.getElementById("fullName").value.trim();
            const contactNumber = document.getElementById("contactNumber").value.trim();
            const emailAddress = document.getElementById("emailAddress").value.trim();

            if (!fullName || !contactNumber || !emailAddress) {
                alert("Please fill in all required fields!");
                return;
            }

            try {
                const contact = new core.Contact(fullName, contactNumber, emailAddress);
                const serialized = contact.serialize();

                if (serialized) {
                    const storageKey = `contact_${fullName.substring(0, 1)}_${Date.now()}`;
                    localStorage.setItem(storageKey, serialized);
                    console.log("Contact saved:", {storageKey, serialized}); // Debug log

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

    document.getElementById("contactListBtn")?.addEventListener("click", () => {
        router.navigate("/contact-list");
    });
}

function DisplayContactListPage() {
    const addButton = document.getElementById("addButton");

    addButton?.addEventListener("click", () =>
        router.navigate("/edit"));

    if (localStorage.length) {
        let html = "";
        let index = 1;

        for (const key of Object.keys(localStorage)) {
            const contact = new core.Contact();
            contact.deserialize(localStorage.getItem(key));

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

        document.getElementById("contactList").innerHTML = html;

        document.querySelectorAll(".edit").forEach(btn =>
            btn.addEventListener("click", function() {
                router.navigate(`/edit#${this.value}`);
            })
        );

        document.querySelectorAll(".delete").forEach(btn =>
            btn.addEventListener("click", function() {
                if (confirm("Delete this contact?")) {
                    localStorage.removeItem(this.value);
                    window.location.reload(); // Required to refresh table
                }
            })
        );
    }
}

function DisplayEditPage() {
    const page = location.hash.substring(1);
    const editButton = document.getElementById("editButton");

    if (page === "add") {
        document.querySelector("h1").textContent = "Add Contact";
        editButton.innerHTML = `<i class="fas fa-plus-circle"></i> Add`;
    } else {
        const contact = new core.Contact();
        contact.deserialize(localStorage.getItem(page));
        document.getElementById("fullName").value = contact.fullName;
        document.getElementById("contactNumber").value = contact.contactNumber;
        document.getElementById("emailAddress").value = contact.emailAddress;
    }

    editButton?.addEventListener("click", function(event) {
        event.preventDefault();
        const contact = new core.Contact(
            document.getElementById("fullName").value,
            document.getElementById("contactNumber").value,
            document.getElementById("emailAddress").value
        );

        if (contact.serialize()) {
            localStorage.setItem(
                page === "add" ? contact.fullName[0] + Date.now() : page,
                contact.serialize()
            );
            router.navigate("/contact-list");
        }
    });
}

// ================== LOGIN/LOGOUT FUNCTIONS ==================
function DisplayLoginPage() {
    const messageArea = document.getElementById("messageArea");
    messageArea.style.display = "none";

    fetch("./data/users.json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("loginButton")?.addEventListener("click", () => {
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;
                let validUser = false;

                data.users.forEach(user => {
                    if (user.Username === username && user.Password === password) {
                        validUser = true;
                        const sessionUser = new core.User(
                            user.DisplayName,
                            user.EmailAddress,
                            user.Username
                        );
                        sessionStorage.setItem("user", sessionUser.serialize());
                    }
                });

                if (validUser) {
                    router.navigate("/contact-list");
                } else {
                    messageArea.textContent = "Invalid username or password!";
                    messageArea.classList.add("alert-danger");
                    messageArea.style.display = "block";
                    document.getElementById("username").focus();
                }
            });
        })
        .catch(console.error);

    document.getElementById("cancelButton")?.addEventListener("click", () => {
        document.getElementById("loginForm").reset();
        router.navigate("/");
    });
}

function DisplayRegisterPage() {
    // Registration logic remains unchanged
}

window.addEventListener("load", Start);