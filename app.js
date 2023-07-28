document.querySelector("html").innerHTML = "";

getMDFile(
    `https://raw.githubusercontent.com/ParadoxPD/blogs/main/homepage.md`
).then((res) => {
    getHTMLFile(res, "")
        .then((content) => {
            document.querySelector("html").innerHTML = content;
            document.querySelector("head").innerHTML += `<style>
    body {
    --headings: #74c0fc;
    --links: #91A7FF;
    --highlight: #41C7C7;
    --bg: #1f242A;
    --bg-secondary: #323945;
    --text: #adb5bd;
    --text-secondary: #9CA3AF;
    --code-text: #91A7FF;
    --share-text: #C4C4C4
}

ul.horizontal-list {
    display: flex;
    margin-top: 0em;
    margin-left: -40px;
    flex-wrap: wrap
}
ul.horizontal-list li {
    display: inline;
    margin-right: 1em
}
ul.horizontal-list li a {
    text-decoration: none;
    font-weight: normal
}
.card {
    padding: 1em;
    border: 1px var(--text) solid;
    width: 15em;
    height: auto;
    text-align: center;
    font-size: 1em;
    align-items: center;
    background-color: var(--bg-secondary);
    margin-bottom: 0.8em;
    border-radius: 0.5em
}
.card .header {
    color: var(--links)
}

.card .header img{
    max-height: 50%;
}
.card .body {
    font-size: 0.8em
}
.card hr {
    margin: 0.5em 0
}
.card .body{
    font-weight:bold;
    font-size: 1.2em;
}

@media screen and (max-width: 600px) {
    ul.horizontal-list li.card {
        width:100%;
        display: block;
        margin-bottom: 1em;
        margin-left: 1em
    }

    ul.horizontal-list li.card a,ul.horizontal-list li.card .header {
        font-size: 1em
    }
}

</style>`;
        })
        .then((__) => {
            document.querySelector("ul").classList.add("horizontal-list");
            let newCards = "";
            getRepoData().then(repoData => {
                repoData.forEach((element) => {
                    console.log(element)
                    newCards += `<li class="card">
                                <a href="#" onclick="clickHandler(this)" markdownuri="${element.url}">
                                    <span class="header">
                                    <img src="${element.thumbnail} "/>  
                                    </span>
                                    <hr>
                                    <p class="body">
                                    ${element.title}
                                    </p>
                                </a>
                            </li>`;
                });
                document.querySelector("ul").innerHTML = newCards;
            });

        });
});


function clickHandler(target) {
    // window.preventDefault()
    console.log(target)
    getMDFile(
        target.getAttribute("markdownuri")
    ).then(res => {
        getHTMLFile(res, target.querySelector(".body").innerHTML).then(content => {

            document.querySelector("html").innerHTML = content;
        });
    });
}


// window.addEventListener("pageshow", function (event) {
//     let historyTraversal = event.persisted ||
//         (typeof window.performance != "undefined" &&
//             window.performance.navigation.type === 2);
//     if (window.performance.navigation.type === 2) {
//         // Handle page restore.
//         window.location.reload();
//     }
// });

window.onpopstate = function () {
    // alert("clicked back button");
    if (!window.location.href.endsWith("#")) {
        window.location.reload();
    }
}; history.pushState({}, '');