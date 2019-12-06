function liveSearch(value) {
    if (value)
        axios.get('/live-search?value='+value)
            .then(function (response) {
                console.log(response);
                let list = document.querySelector("ul.live-search"),
                    data = response.data,
                    listItens = "";
                data.map((elem) => {
                    listItens += '<li class="live-search-item">' + elem + '</li>\n'
                })
                list.innerHTML = listItens;

        })
    else
        document.querySelector("ul.live-search").innerHTML = "";
}
