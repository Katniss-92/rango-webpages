function selectSubscription(plan) {
  console.log('Selected plan:', plan);
  window.location.href = '/pages/service.html?plan=' + plan;
}
