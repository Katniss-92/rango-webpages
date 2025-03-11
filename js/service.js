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
    const container = document.getElementById('info-boxes-container');
    const serviceName = document.getElementById('service_name');
    serviceName.innerText = infoBoxData['service_name'];
    //۲
    infoBoxData['notes'].forEach(box => {
        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';
        box.lines.forEach(line => {
            const infoLine = document.createElement('div');
            infoLine.className = 'info-line';

            if (line.type === 'attention') {
                infoLine.classList.add('attention');
            }

            infoLine.textContent = line.text;

            infoBox.appendChild(infoLine);
        });

        container.appendChild(infoBox);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    const infoBoxData = await fetchInfoBoxData();
    createInfoBoxes(infoBoxData);
});
