const blogURI = "https://github.com/ParadoxPD/blogs";

const markdownToHTMLURI =
    "https://us-central1-markdown-to-html-microservice.cloudfunctions.net/api";

const repoName = "blogs";
const userName = "ParadoxPD";
const githubURI = `https://api.github.com/repos/${userName}/${repoName}`;


const getHTMLFile = async (markdownContent, title) => {
    let content = await axios.post(markdownToHTMLURI,
        {
            "data": `${markdownContent}`,
            "theme": "dark",
            "title": `${title}`,
            "type": "page"
        }
    )

    return (content.data);
}



const getRepoData = async () => {
    let data = await axios
        .get(githubURI + "/git/trees/main?recursive=1")
        .then((response) => {
            return response.data.tree;
        });

    let repoData = [];

    data.filter(element => element.path.endsWith(".md") && !element.path.startsWith("homepage") && !element.path.startsWith("README")).forEach((file) => {
        repoData.push({
            url: `https://raw.githubusercontent.com/${userName}/${repoName}/main/${file.path}`,
            title: file.path,
            thumbnail: `https://raw.githubusercontent.com/${userName}/${repoName}/main/images/${file.path.split(".")[0]
                }.jpg`,
        });
    });
    return repoData;
};

const getMDFile = async (URL) => {
    let content = await axios.get(URL).then((response) => {
        return response.data;
    });
    return content;
};


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

    getMDFile(
        target.getAttribute("markdownuri")
    ).then(res => {
        getHTMLFile(res, target.querySelector(".body").innerHTML).then(content => {

            document.querySelector("html").innerHTML = content;
        });
    });
}


window.onpopstate = function () {
    if (!window.location.href.endsWith("#")) {
        window.location.reload();
    }
}; history.pushState({}, '');