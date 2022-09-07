import { githubURI } from "../../global";
import axios from "axios";

const getRepoData = () => {
  axios.get(githubURI + "/git/trees/main?recursive=1", (response) => {
    console.log(response.body);
  });
};

export { getRepoData };
