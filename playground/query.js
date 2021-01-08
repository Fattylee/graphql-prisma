const _axios = require("axios");
const fs = require("fs");
require("json-server");
const axios = _axios.create({ baseURL: "http://localhost:3000" });
const createResource = async () => {
  // const { data } = await axios.post("users", {
  //   name: "keep",
  //   email: "keep@gmail",
  // });
  const { data } = await axios.post("posts", null, {
    data: {
      title: "left me",
      body: "andela was great",
      published: true,
      userId: 5,
    },
  });
  return data;
};
const bootstrap = async () => {
  // console.log(await createResource());

  let { data, headers } =
    (await axios
      // .get("users/1/posts?title=title two")
      // .get("users/3/posts", {
      //   params: {
      //     title: "title one",
      //   },
      // })
      // .get("users/6/posts")
      .get("posts?_limit=2&_page=10")
      // .get("posts?_limit=15&_sort=title")
      // .get("posts?_limit=15&_page=1&_sort=title&_order=desc")
      .catch((ex) => console.log("Error:", ex.message))) || {};

  console.log(data);
  console.log(headers);
  const links = headers.link.split(", ");
  // console.log(links);
  // const obj = {};
  // links.forEach((l) => {
  //   const [tag, rel] = l.split("; ");
  //   obj[rel.slice(4).replace(/"/g, "")] = tag.replace(/<|>/g, "");
  // });

  const obj = links.reduce((acc, l) => {
    const [tag, rel] = l.split("; ");
    acc[rel.slice(4).replace(/"/g, "")] = tag.replace(/<|>/g, "");
    return acc;
  }, {});

  console.log(obj);
  // ({ data } = await axios.get("posts"));
  // console.log(data);
};

bootstrap();

// GET request for remote image
// _axios({
//   method: "get",
//   url: "http://bit.ly/2mTM3nY",
//   responseType: "stream",
// }).then(function (response) {
//   console.log(response.data.pipe);
//   response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"));
// });
