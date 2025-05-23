function showPage(pageId) {
    document.querySelectorAll('.container > div').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function goHome() {
    window.location.href = '/rango-webpages';
}

function confirmPayment() {
    window.open("https://t.me/RangoNetwork_bot", "_blank");
}

async function fetchInfoBoxData() {
    let serviceName = '';
    try {
        const urlParams = new URLSearchParams(window.location.search);

        const selectedPlan = urlParams.get("plan");

        if (selectedPlan) {
            serviceName = selectedPlan;
            const selectedCard = document.querySelector(`.subscription-card[onclick="selectSubscription('${selectedPlan}')"]`);
            if (selectedCard) {
                selectedCard.classList.add("highlighted");
            }
        }
    } catch (e) {

    }
    try {
        const response = await fetch('../contents/service-info.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data[serviceName] || [];
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        return [];
    }
}

function createInfoBoxes(infoBoxData) {
    const container = document.getElementById('info-boxes-container');
    const priceTag = document.getElementById('price_tag');
    const cardNumber = document.getElementById('card_number');
    const cardName = document.getElementById('card_name');
    const serviceName = document.getElementsByClassName('service_name highlight');
    serviceName[0].innerText = infoBoxData['service_name'];
    serviceName[1].innerText = infoBoxData['service_name'];
    //
    cardName.innerText = infoBoxData['card_name'];
    cardNumber.innerText = infoBoxData['card'];
    priceTag.innerText = infoBoxData['price'];

    let htmlString = '';
    infoBoxData['notes'].forEach(box => {
        htmlString += '<div class="info-box">';
        box.lines.forEach(line => {
            const className = line.type === 'attention' ? 'info-line attention' : 'info-line';
            htmlString += `<div class="${className}">${line.text}</div>`;
        });
        htmlString += '</div>';
    });

    container.innerHTML = htmlString;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading indicator
    const container = document.getElementById('info-boxes-container');
    container.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

    const infoBoxData = await fetchInfoBoxData();

    // Clear loading indicator
    container.innerHTML = '';
    createInfoBoxes(infoBoxData);
});
