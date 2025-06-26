const APP_URL = "https://api.rangonet.de";
document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.querySelector('.login-btn');
    loginButton.disabled = true;

    document.getElementById('tokenInput').addEventListener('input', function () {
        loginButton.disabled = this.value.length < 10;
    });
});

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('tokenInput').value = text;
        const loginButton = document.querySelector('.login-btn');

        if (text.length > 20)
            loginButton.disabled = false;
    } catch (err) {
        document.getElementById('tokenInput').focus();
    }
}

document.getElementById('tokenInput').addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        this.placeholder = 'Insert you access token here';
    }
});


function openTelegramBot() {
    window.open("https://t.me/RangoNetwork_bot", "_blank");
}

async function authorizeToken() {
    const tokenInput = document.getElementById('tokenInput').value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        accessToken: tokenInput
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${APP_URL}/authorize`, requestOptions);
        const result = await response.json();

        if (result.bearerToken) {
            localStorage.setItem("bearerToken", result.bearerToken);
            console.log("Bearer token saved to localStorage:", result.bearerToken);
            document.getElementById("errorMessage").style.display = "none";
            window.location.href = `../pages/profile`;
        } else {
            console.error("Authorization failed:", result);
            document.getElementById("errorMessage").style.display = "block";

        }
    } catch (error) {
        console.error("Error during authorization:", error);
    }
}
