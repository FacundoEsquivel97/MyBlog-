document.addEventListener('DOMContentLoaded',()=>{
    const postContainer = document.querySelector('.post-container');
    const postTemplate = document.querySelector('.post-template').content;

    const peticion = (endpoint,func) => {
        fetch('https://jsonplaceholder.typicode.com/'+endpoint)
        .then((response) => response.json())
        .then((json) => {func(json)})
        .catch((error)=> {console.log(error)})
    }
    const renderPost = (data) =>{
        const clone = postTemplate.cloneNode(true);
        const fragment = document.createDocumentFragment();
        clone.querySelector('.post-title').textContent = data.title ;
        clone.querySelector('.post-body').textContent = data.body ;
        peticion(`users/${data.userId}`,(user) => {
            document.querySelectorAll('.post-user')[data.userId-1].textContent = user.username
        })
        fragment.appendChild(clone);
        postContainer.appendChild(fragment);
    }

const sumarPost = () => {
    let postsCount = localStorage.getItem("postsCount") || 100;
    postsCount = JSON.parse(postsCount);
    postsCount ++;
    localStorage.setItem("postsCount", JSON.stringify(postsCount));
}

 for (let i = 1; i < postsCount; i += 10) {
      peticion(`posts/${i}`,renderPost)
    }



});