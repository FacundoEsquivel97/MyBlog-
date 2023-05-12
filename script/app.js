document.addEventListener('DOMContentLoaded',()=>{
    const postContainer = document.querySelector('.post-container');
    const postTemplate = document.querySelector('.post-template').content;
    const pagination = document.querySelector('.pagination');

    let pageNumber = 0
    const postsPerPage = 6;

    const peticion = (endpoint,func) => {
        fetch('https://jsonplaceholder.typicode.com/'+endpoint)
        .then((response) => response.json())
        .then((res) => {func(res)})
        .catch((error)=> {console.log(error)})
    }
    const renderPost = (data) =>{
        if (data !== undefined) {
        const clone = postTemplate.cloneNode(true);
        const fragment = document.createDocumentFragment();
        let cloneUser = clone.querySelector('.post-user')
        clone.querySelector('.post-title').textContent = data.title ;
        clone.querySelector('.post-body').textContent = data.body ;
        peticion(`users/${data.userId}`,(user) => 
        {cloneUser.textContent = user.username})
        fragment.appendChild(clone);
        postContainer.appendChild(fragment);
        }
    }

    const handleNextPage = (index,postsList) => {
        pageNumber = index
        while (postContainer.lastChild) {postContainer.removeChild(postContainer.lastChild)}
        renderPage(postsList)
    }

    const renderPage = (postsList) =>{
        let numberOfPages = Math.ceil(postsList.length / postsPerPage) ;
        for (let i = pageNumber*postsPerPage; i < (postsPerPage+(pageNumber*postsPerPage)); i ++) {
          renderPost(postsList[i])
        }
        if (!pagination.hasChildNodes()) {
            for (let index= 0 ; index <= numberOfPages - 1; index ++) {
                const nextPageButton = document.createElement('button');
                nextPageButton.textContent = index + 1
                nextPageButton.addEventListener('click',() => {handleNextPage(index,postsList)});
                pagination.appendChild(nextPageButton)}
        }
        }

peticion(`posts`, (postsList)=> {
    postsList = postsList.sort(() => Math.random() - 0.5) 
    renderPage(postsList)
})
});



