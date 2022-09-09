import { githubURI, repoName, userName } from "../../global";
import axios from "axios";

const getRepoData = async () => {
  console.log("hello");
  let data = await axios
    .get(githubURI + "/git/trees/main?recursive=1")
    .then((response) => {
      return response.data.tree;
    });

  let repoData = [];

  data.forEach((file) => {
    if (applyFilter(file))
      repoData.push({
        url: `https://raw.githubusercontent.com/${userName}/${repoName}/main/${file.path}`,
        title: file.path,
        thumbnail: `https://raw.githubusercontent.com/${userName}/${repoName}/main/images/${
          file.path.split(".")[0]
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

const applyFilter = (data) => {
  return data.path.endsWith(".md");
};

export { getRepoData, getMDFile };
