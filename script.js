document.addEventListener('DOMContentLoaded',()=>{
    const container = document.querySelector('.container')

    const peticion = (endpoint,func) => {
        fetch('https://jsonplaceholder.typicode.com/'+endpoint)
        .then((response) => response.json())
        .then((json) => {func(json.body)})
    }
    const renderPost = (data) =>{
        //const clone = tmp.cloneNode(true);
        //const fragment = document.createDocumentFragment();
        let child = document.createElement('div')
        child.innerHTML = data
        child.className = 'post'
        container.appendChild(child)
        //fragment.appendChild(clone);
        //container.appendChild(fragment);
    }

   // for (let i = 1; i <= 5; i++) {
     //   peticion(`posts/${i}`,renderPost)
    //}
    
});