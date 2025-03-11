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
    alert('درخواست شما ثبت شد. لطفا منتظر تأیید بمانید.');
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
    console.warn('start' + infoBoxData, new Date());
    const container = document.getElementById('info-boxes-container');
    const serviceName = document.getElementById('service_name');
    serviceName.innerText = infoBoxData['service_name'];

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
    console.warn('END' + infoBoxData, new Date());
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading indicator
    const container = document.getElementById('info-boxes-container');
    container.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

    console.warn('start LOAD', new Date());
    const infoBoxData = await fetchInfoBoxData();
    console.warn('END LOAD' + infoBoxData, new Date());

    // Clear loading indicator
    container.innerHTML = '';
    createInfoBoxes(infoBoxData);
});
