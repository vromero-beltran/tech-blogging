document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('#logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

async function logout() {
    console.log('Logout button clicked');
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        document.location.replace('/');
    } else {
        alert('Failed to log out.');
    }
}