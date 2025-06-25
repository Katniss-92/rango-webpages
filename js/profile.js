const copyButton = document.querySelector('.copy-btn');
const configCode = document.querySelector('.config-code');

// Add a click event listener to the button
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
