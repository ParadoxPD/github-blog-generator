import { useState } from "react";
import { getRepoData, getMDFile } from "./api/githubHandler";
import HomePage from "./pages/homepage";

function App() {
  const [image, setImage] = useState(null);

  // getRepoData().then((data) => {
  //   console.log(data);
  //   setImage(data[0].thumbnail);
  //   data.forEach((file) => {
  //     getMDFile(file.url).then((data) => {
  //       console.log(data);
  //     });
  //   });
  // });

  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
