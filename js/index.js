function selectSubscription(plan) {
    console.log('Selected plan:', plan);
    window.location.href = 'pages/service.html?plan=' + plan;
}

function selectFreeAccount() {
    window.open("https://t.me/RangoNetwork_bot", "_blank");
}

// Global variable to store subscription data
let subscriptionsData = null;

// Function to load subscriptions from JSON file
async function loadSubscriptions() {
    try {
        const response = await fetch('../contents/subscriptions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        subscriptionsData = await response.json();
        renderSubscriptions();
    } catch (error) {
        console.error('Error loading subscriptions:', error);
        // Fallback: show error or use default data
        document.getElementById('subscriptions-container').innerHTML =
            '<div style="text-align: center; padding: 20px; color: #ff5252;">خطا در بارگذاری اطلاعات</div>';
    }
}

// Function to render subscription cards
function renderSubscriptions() {
    const container = document.getElementById('subscriptions-container');

    if (!subscriptionsData || !subscriptionsData.subscriptions) {
        container.innerHTML = '<div style="text-align: center; padding: 20px;">داده‌ای یافت نشد</div>';
        return;
    }

    let html = '';
    subscriptionsData.subscriptions.forEach(subscription => {
        const cssClass = subscription.cssClass ? ` ${subscription.cssClass}` : '';

        html += `
            <div class="subscription-card${cssClass}" onclick="selectSubscription('${subscription.id}')">
                <div class="right-content">
                    <div class="subscription-type">${subscription.type}</div>
                    <div class="subscription-desc">${subscription.description}</div>
                </div>
                <div class="left-content">
                    <div class="subscription-details">${subscription.details}</div>
                    <div class="price">${subscription.price}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Function to update subscription data
function updateSubscription(id, newData) {
    if (!subscriptionsData || !subscriptionsData.subscriptions) {
        console.error('Subscriptions data not loaded');
        return;
    }

    const subscription = subscriptionsData.subscriptions.find(sub => sub.id === id);
    if (subscription) {
        Object.assign(subscription, newData);
        renderSubscriptions();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadSubscriptions();
});
