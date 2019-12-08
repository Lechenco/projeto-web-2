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
    else
        document.querySelector("ul.live-search").innerHTML = "";
}

function clickLiveSearch(elem) {
    document.querySelector("input.search-input").value = elem.innerHTML;
    document.querySelector("ul.live-search").innerHTML = "";
}
