const form = document.querySelector('form');
form.addEventListener('submit', stopFormDefault);

function stopFormDefault(event) {
    event.preventDefault();
    signin();
}

function signin() {
    const errorParagraph = document.getElementById("errorMessage");
    errorParagraph.innerText = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        errorParagraph.innerText = "Please fill in both fields.";
        errorParagraph.style.color = "red";
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        errorParagraph.innerText = "No registered user found. Please sign up.";
        errorParagraph.style.color = "red";
        return;
    }

    if (userData.email === email) {
        if (userData.password === password) {
            window.location.replace("home.html");
        } else {
            errorParagraph.innerText = "Invalid password. Please try again.";
            errorParagraph.style.color = "red";
        }
    } else {
        errorParagraph.innerText = "User does not exist. Please try again.";
        errorParagraph.style.color = "red";
    }
}
