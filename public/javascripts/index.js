function liveSearch(value) {
    if (value)
        axios.get('/live-search?value='+value)
            .then(function (response) {
                console.log(response);
                let list = document.querySelector("ul.live-search"),
                    data = response.data,
                    listItens = "";
                data.map((elem) => {
                    listItens += '<li class="live-search-item" onclick="clickLiveSearch(this)">' 
                                + elem + '</li>\n';
                })
                list.innerHTML = listItens;
        })
    else {
        document.querySelector("ul.live-search").innerHTML = "";
    }
        document.querySelector('.search-form').addEventListener('keypress', (e) => {
            if (e.which == 13) {
                e.preventDefault();
               getImageName(value); 
            }
        });
    }

function clickLiveSearch(elem) {
    document.querySelector("input.search-input").value = elem.innerHTML;
    document.querySelector("ul.live-search").innerHTML = "";
}
function getImageName(value){
    document.querySelector('#progresso').style.display = 'block'
    axios.get('/search?query=' + value).then(function (response) {
        let post = document.querySelector('.post-container');
        post.innerHTML = "";
        console.log(response.data);
        for (let i = 0; i< response.data.posts.length; i++) {
            console.log("test")

            let openDiv = '<div class="post">';
            let img = response.data.posts[i].imagem ? '<img class = "feed-image" src = "uploads/' 
                        + response.data.posts[i].imagem + '">' : "";
            let descript = '<div class = "dark">' + response.data.posts[i].descricao + '</div>';
            let closeDiv = '</div>';
    
            post.innerHTML += openDiv;
            post.innerHTML += img;
            post.innerHTML += descript;
            post.innerHTML += closeDiv;
        }    
    document.querySelector('#progresso').style.display = 'none'
    })
    
}
