function selectSubscription(plan) {
    console.log('Selected plan:', plan);
    window.location.href = 'pages/service.html?plan=' + plan;
}

function selectFreeAccount() {
    window.open("https://t.me/RangoNetwork_bot", "_blank");
}
