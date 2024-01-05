document.addEventListener('DOMContentLoaded', () => {

    async function signupFormHandler(event) {
        event.preventDefault();

        const username = document.querySelector('#username-signup').value.trim();
        const password = document.querySelector('#password-signup').value.trim();

        if (username && password) {
            const response = await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                document.location.replace('/dashboard');
                // give user a success message
                alert('You have successfully signed up.');
            } else {
                alert(response.statusText);
                console.log(response);
            }
        }
    };
    document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
});