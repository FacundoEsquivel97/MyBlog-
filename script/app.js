document.addEventListener('DOMContentLoaded',()=>{
    const main = document.querySelector('.main');
    const postContainer = document.querySelector('.post-container');
    const postTemplate = document.querySelector('.post-template').content;
    const commentTemplate = document.querySelector('.comment-template').content;
    const alertTemplate = document.querySelector('.alert-template').content;
    const pagination = document.querySelector('.pagination');
    const newPost = document.querySelector('.newPost')
    const newPostButton = newPost.querySelector('input[type=submit]')
    const newPostInputTitle = newPost.querySelector('input[type=text]')
    const newPostInputText = newPost.querySelector('textarea')
    const postsPerPage = 8;
    let pageNumber = 0

    const peticion = (endpoint,func) => {
        fetch('https://jsonplaceholder.typicode.com/'+endpoint)
        .then((response) => response.json())
        .then((res) => {func(res)})
        .catch((error)=> {console.log(error)})
    }
    const mostrarAlerta = (mensaje) => {
        const alertClone = alertTemplate.cloneNode(true);
        const alertFragment = document.createDocumentFragment();
        alertClone.querySelector('.alertText').textContent = mensaje;
        alertClone.querySelector('.alertButton').addEventListener('click',(e) => {e.target.parentNode.remove()})
        alertFragment.appendChild(alertClone);
        main.appendChild(alertFragment);
    }

    const openPost = (postId) => {
        main.innerHTML = '';
        peticion(`posts/${postId}`,(post)=>{
            const postClone = postTemplate.cloneNode(true);
            const postFragment = document.createDocumentFragment();
            let cloneUser = postClone.querySelector('.post-user')
            postClone.querySelector('.post-title').textContent = post.title ;
            postClone.querySelector('.post-body').textContent = post.body ;
            peticion(`users/${post.userId}`,(user) => {cloneUser.textContent = user.username})
            const comments = postClone.querySelector('.comments');
            const postComentCount = postClone.querySelector('.post-comments-count strong');
            peticion(`posts/${post.id}/comments`,(comment)=>{
                postComentCount.textContent = comment.length; 
                for (let i = 0 ; i < comment.length; i++){
                const commentClone = commentTemplate.cloneNode(true);
                const commentFragment = document.createDocumentFragment();
                commentClone.querySelector('.comment-user').textContent = comment[i].email;
                commentClone.querySelector('.comment-body').textContent = comment[i].body ;
                commentFragment.appendChild(commentClone);
                comments.appendChild(commentFragment);
                }
            })
            postClone.querySelector('.goBack').classList.remove('hide');
            postClone.querySelector('.goBack').addEventListener('click',()=>{
                location.reload()
            });
            postClone.querySelector('.comments-container').classList.remove('hide');
            postClone.querySelector('.commentSubmit').addEventListener('click',(e)=> {
            e.preventDefault()
            if(e.target.parentNode.querySelector('.inputComment').value == ''){
                mostrarAlerta('No puedes enviar un comentario vacio!')
            } else {
            postNewComment(e.target.parentNode.querySelector('.inputComment').value,postId)
            mostrarAlerta('Comentario enviado!')
            }
            e.target.parentNode.querySelector('.inputComment').value= '';
            })
            postFragment.appendChild(postClone);
            main.appendChild(postFragment);
        })
    }

    const renderPost = (post) =>{
        if (post !== undefined) {
        const postClone = postTemplate.cloneNode(true);
        const postFragment = document.createDocumentFragment();
        postClone.querySelector('.post').addEventListener('click',()=>{openPost(post.id)})
        let cloneUser = postClone.querySelector('.post-user')
        let cloneCommentsCount= postClone.querySelector('.post-comments-count strong')
        postClone.querySelector('.post-title').textContent = post.title ;
        postClone.querySelector('.post-body').textContent = post.body ;
        peticion(`users/${post.userId}`,(user) => {cloneUser.textContent = user.username})
        peticion(`posts/${post.id}/comments`,(user) => {cloneCommentsCount.textContent = user.length})
        postFragment.appendChild(postClone);
        postContainer.appendChild(postFragment);
        }
    }

    const handleNextPage = (index,postsList) => {
        pageNumber = index - 1
        if (postContainer.childNodes.length != 0) {postContainer.innerHTML = ''}
        renderPage(postsList)
        renderPagination(postsList)
    }

    const renderPage = (postsList) =>{
        for (let i = pageNumber*postsPerPage; i < (postsPerPage+(pageNumber*postsPerPage)); i ++) {
          renderPost(postsList[i])
        }
    }
    const renderPagination = (postsList) => {
        if (pagination.childNodes.length != 0) {pagination.innerHTML = ''}
        let numberOfPages = Math.ceil(postsList.length / postsPerPage)
        for (let index= 0 ; index <= numberOfPages-1; index ++) {
            const nextPageButton = document.createElement('button');
            nextPageButton.textContent = index + 1
            nextPageButton.addEventListener('click',(e) => {handleNextPage(e.target.textContent,postsList)});
            nextPageButton.textContent == pageNumber + 1 ? nextPageButton.classList.add('active') : nextPageButton.classList.remove('active') 
            pagination.appendChild(nextPageButton)
        }
    }

    const postNewComment = (comment,postId) => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({"postId": 1,
            id: 6,
            name: "username",
            email: "user@placeholder.com",
            body: comment
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    const postNewPost = (titlePost,bodyPost) => {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                userId: 1,
                id: 101,
                title: titlePost,
                body: bodyPost,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
    
    newPostButton.addEventListener('click',(e)=>{
            e.preventDefault()
            if(newPostInputTitle.value == '' || newPostInputText.value == ''){
                mostrarAlerta('No puedes enviar un post sin titulo o sin texto!');}
            else {
            postNewPost(newPostInputTitle.value,newPostInputText.value);
            mostrarAlerta('Post enviado!');}
            newPostInputTitle.value = '';
            newPostInputText.value = '';
    })

    
    peticion(`posts`, (postsList)=> {
        renderPage(postsList)
        renderPagination(postsList)
    })
})


