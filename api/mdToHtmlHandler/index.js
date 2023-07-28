

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

