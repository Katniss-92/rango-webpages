const APP_URL = "https://api.rangonet.de";

const copyButton = document.querySelector('.copy-btn');
const configCode = document.querySelector('.config-code');
window.onload = () => {
    const bearerToken = localStorage.getItem('bearerToken');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (!bearerToken && !token) {
        window.location.href = '../pages/login'; // Redirect to login page
    } else if (!!token) {
        authorizeToken(token)
    } else {
        requestService();
        getUserUsage();
    }
};

async function authorizeToken(token) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        accessToken: token
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
            requestService();
            getUserUsage();
        } else {
            window.location.href = '../pages/login';

        }
    } catch (error) {
        window.location.href = '../pages/login';
    }
}


function requestService() {
    const bearerToken = localStorage.getItem('bearerToken');
    if (bearerToken) {
        const myHeaders = new Headers();
        myHeaders.append("authorization", `Bearer ${bearerToken}`);

        const raw = "";

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${APP_URL}/profile/userinfo`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const parsedResult = JSON.parse(result);
                if (parsedResult.service) {
                    //
                    const configCodeElement = document.getElementById("configCode");
                    const activeServiceElement = document.getElementById("activeService");
                    const remainingDaysElement = document.getElementById("remainingDays");
                    const serverSection = document.getElementById("serverSection");
                    const connectionHelp = document.getElementById("connectionHelp");
                    const trafficElement = document.getElementById("remainingTraffic");
                    const connectionGuidIos = document.getElementById("connectionGuidIos");
                    const connectionGuidAndroid = document.getElementById("connectionGuidAndroid");
                    //
                    if (parsedResult.service.service_Expired) {
                        serverSection.style.display = 'none';
                        connectionHelp.style.display = 'none';
                        remainingDaysElement.style.display = 'none';
                        trafficElement.style.display = 'none';
                        activeServiceElement.textContent = 'شما سرویس فعالی ندارید';
                    }
                    //
                    else {
                        configCodeElement.textContent = parsedResult.servers[0].access_key;
                        if (parsedResult.os === 'ANDROID' || parsedResult.os === 'WEB') {
                            connectionGuidAndroid.style.display = 'block';
                            connectionGuidIos.style.display = 'none';
                            connectionHelp.style.display = 'none';
                            serverSection.style.display = 'none';
                        } else {
                            connectionGuidIos.style.display = 'block';
                            connectionGuidAndroid.style.display = 'none';
                            serverSection.style.display = 'block';
                            connectionHelp.style.display = 'block';
                        }
                        activeServiceElement.textContent = "سرویس فعال: " + parsedResult.service.service_name;
                        remainingDaysElement.textContent = "زمان باقی مانده: " + calculateRemainingDays(parsedResult.service.expire_data) + " روز ";
                    }
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    window.location.href = '../pages/login'; // Redirect to login page
                } else {
                    console.error(error);
                }
            });
    }
}

function getUserUsage() {
    const bearerToken = localStorage.getItem('bearerToken');
    if (bearerToken) {
        const myHeaders = new Headers();
        myHeaders.append("authorization", `Bearer ${bearerToken}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${APP_URL}/user/usage`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const resultJson = JSON.parse(result);
                if (resultJson.usage !== undefined)
                    document.getElementById("remainingTraffic").textContent = "ترافیک باقی مانده: "
                        + ((resultJson.traffic_limit - resultJson.usage) / 1000).toFixed(1) + " گیگابایت از " + resultJson.traffic_limit / 1000 + " گیگابایت "
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    window.location.href = '../pages/login'; // Redirect to login page
                } else {
                    console.error(error);
                }
            });
    } else {
        console.error("Bearer token not found in localStorage.");
    }
}

function calculateRemainingDays(unixTimestamp) {
    const currentDate = new Date();
    const targetDate = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds

    // Calculate the difference in time (milliseconds)
    const timeDifference = targetDate - currentDate;

    // Convert the difference to days
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return remainingDays > 0 ? remainingDays : 0; // Return 0 if the date has passed
}

copyButton.addEventListener('click', () => {
    const textToCopy = configCode.textContent.trim(); // Get the text content
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            notie.alert({type: 'success', text: 'کپی شد', time: 2, position: 'bottom'}) // Hides after 2 seconds
        })
        .catch((error) => {
            console.error('Failed to copy text: ', error);
        });
});

function confirmPayment() {
    window.open("https://t.me/RangoNetwork_bot", "_blank");
}


function buyService() {
    window.open("/")
}
