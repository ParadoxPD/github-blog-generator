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
    --share-text: #C4C4C4;
}

ul.horizontal-list {
    display: flex;
    margin-top: 0em;
    margin-left: -40px;
    flex-wrap: wrap;
}
ul.horizontal-list li {
    display: inline;
    margin-right: 1em;
}
ul.horizontal-list li a {
    text-decoration: none;
    font-weight: normal;
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
    border-radius: 0.5em;
    transition:all 0.25s ease-in-out;
}

.card:hover{
    transform:scale(1.05);
}
.card .header {
    color: var(--links);
}

.card .header img{
    max-height: 50%;
}
.card .body {
    font-size: 0.8em;
}
.card hr {
    margin: 0.5em 0;
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
        margin-left: 1em;
    }

    ul.horizontal-list li.card a,ul.horizontal-list li.card .header {
        font-size: 1em;
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
                hljs.highlightAll();
                getCopyCodeButton();
            });

        });
});


function clickHandler(target) {

    getMDFile(
        target.getAttribute("markdownuri")
    ).then(res => {
        getHTMLFile(res, target.querySelector(".body").innerHTML).then(content => {

            document.querySelector("html").innerHTML = content;
            hljs.highlightAll();
            getCopyCodeButton();
        });
    });
}


window.onpopstate = function () {
    if (!window.location.href.endsWith("#")) {
        window.location.reload();
    }
}; history.pushState({}, '');

let copyIcon = `
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512" style="display: block;" transform="scale(0.65)">
                            <g>
                                <g>
                                <path fill="000000" d="M480.6,109.1h-87.5V31.4c0-11.3-9.1-20.4-20.4-20.4H31.4C20.1,11,11,20.1,11,31.4v351c0,11.3,9.1,20.4,20.4,20.4h87.5    v77.7c0,11.3,9.1,20.4,20.4,20.4h341.3c11.3,0,20.4-9.1,20.4-20.4v-351C501,118.3,491.9,109.1,480.6,109.1z M51.8,362V51.8h300.4    v57.3H139.3c-11.3,0-20.4,9.1-20.4,20.4V362H51.8z M460.2,460.2H159.7V150h300.4V460.2z"/>
                                <path fill="000000" d="m233.3,254.4h155.8c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-155.8c-11.3,0-20.4,9.1-20.4,20.4 0,11.2 9.1,20.4 20.4,20.4z"/>
                                <path d="m233.3,396.6h155.8c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-155.8c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4z"/>
                                </g>
                            </g>
                        </svg>
                    `;


function getCopyCodeButton() {
    const codes = document.querySelectorAll("pre");
    codes.forEach((codeBlock) => {
        let htmlCode = codeBlock.innerHTML;

        htmlCode += `
                                            <button class="copy-code-button" onclick="copyCode(this)">
                                                ${copyIcon}
                                            </button>
                                            <span class = "copy-code-success-message">
                                                Copied!
                                            </span>
                                        `;
        codeBlock.innerHTML = htmlCode;
    });
}

function copyCode(event) {
    const color = "#32CE55AA";
    const codeBlock = event.parentElement;
    let codeSnippet = codeBlock.querySelector('code').innerText;
    console.log(codeSnippet);
    const cb = navigator.clipboard;
    cb.writeText(codeSnippet).then(() => {
        const copyMessage = codeBlock.querySelector('.copy-code-success-message');
        const codeCopyButton = codeBlock.querySelector('.copy-code-button');
        const codeCopyButtonSVG = codeBlock.querySelector('.copy-code-button svg');
        copyMessage.style.opacity = 1;
        copyMessage.style.color = color;
        codeCopyButton.setAttribute('style', `border-color: #32CE55AA !important `);
        codeCopyButtonSVG.setAttribute('style', `fill: #32CE55AA !important `);
        console.log(codeCopyButton);
        setTimeout(() => {
            copyMessage.style.opacity = 0;
            codeCopyButton.setAttribute('style', 'border-color:#40454C60');
            codeCopyButtonSVG.setAttribute('style', 'fill:#80858C99');
        }, 600);
    });
}