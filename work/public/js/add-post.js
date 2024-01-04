async function newFormHandler(event) {

    event.preventDefault();
    const title = document.querySelector('#post-title').value;
    const content = document.querySelector('#post-text').value;

    const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
            title,
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
        // give user a success message
        alert('You have successfully created a new post.');
    } else {
        alert(response.statusText);
        console.log(response);
    }
}
document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);