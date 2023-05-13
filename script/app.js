document.addEventListener('DOMContentLoaded',()=>{
    const postContainer = document.querySelector('.post-container');
    const postTemplate = document.querySelector('.post-template').content;
    const commentTemplate = document.querySelector('.comment-template').content;
    const pagination = document.querySelector('.pagination');
    const newPost = document.querySelector('.newPost')
    const newPostButton = newPost.children[2]
    const newPostInputTitle = newPost.children[0]
    const newPostInputText = newPost.children[1]

    let pageNumber = 0
    const postsPerPage = 6;

    const peticion = (endpoint,func) => {
        fetch('https://jsonplaceholder.typicode.com/'+endpoint)
        .then((response) => response.json())
        .then((res) => {func(res)})
        .catch((error)=> {console.log(error)})
    }

    const renderPost = (post) =>{
        if (post !== undefined) {
       
        const postClone = postTemplate.cloneNode(true);
        const postFragment = document.createDocumentFragment();
        let cloneUser = postClone.querySelector('.post-user')
        postClone.querySelector('.post-title').textContent = post.title ;
        postClone.querySelector('.post-body').textContent = post.body ;
        peticion(`users/${post.userId}`,(user) => {
            cloneUser.textContent = user.username
        })
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
        postClone.querySelector('.post-footer').addEventListener('click',(e)=>{
                e.stopImmediatePropagation()
                e.target.parentNode.classList.toggle('active');
                e.target.parentNode.parentNode.childNodes[7].classList.toggle('hide')
        })
        postFragment.appendChild(postClone);
        postContainer.appendChild(postFragment);
        }
    }

    const handleNextPage = (index,postsList) => {
        pageNumber = index
        while (postContainer.lastChild) {postContainer.removeChild(postContainer.lastChild)}
        renderPage(postsList)
    }

    const renderPage = (postsList) =>{
        for (let i = pageNumber*postsPerPage; i < (postsPerPage+(pageNumber*postsPerPage)); i ++) {
          renderPost(postsList[i])
        }
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
            postNewPost(newPostInputTitle.value,newPostInputText.value)
            newPostInputTitle.value = '';
            newPostInputText.value = '';
    })

    peticion(`posts`, (postsList)=> {
    postsList = postsList.sort(() => Math.random() - 0.5) 
    renderPage(postsList)
    let numberOfPages = Math.ceil(postsList.length / postsPerPage)
    for (let index= 0 ; index <= numberOfPages - 1; index ++) {
        const nextPageButton = document.createElement('button');
        nextPageButton.textContent = index + 1
        nextPageButton.addEventListener('click',() => {handleNextPage(index,postsList)});
        pagination.appendChild(nextPageButton)}
    })
})


