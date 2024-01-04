// 
async function createPostHandler(event) {
    event.preventDefault();
    const userId = sessionStorage.getItem('user_id');

    document.location.replace('/dashboard/new-post?user_id=' + userId);
}

document.querySelector('#create-new-post').addEventListener('click', createPostHandler);