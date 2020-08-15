import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466/books/",
});
export default prisma;

// (async () => {
//   try {
//     // const data = await prisma.query.users(null, "{ id name age email }");
//     // console.log(data);
//     // console.log(await prisma.exists.User({ id: "ckduffkpp00670833vztj5hy" }));
//     const data = await prisma.mutation.createUser({
//       data: {
//         name: "abdullah ibn abdulfattah",
//         ema
//       },
//     });
//   } catch (ex) {
//     console.log("error", ex.message);
//   }
// })();
