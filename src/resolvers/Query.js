const Query = {
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  posts(parent, args, { prisma }, info) {
    const argsOp = {};
    if (args.query) {
      argsOp.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }],
      };
    }
    return prisma.query.posts(argsOp, info);
    // if (!args.query) return posts;
    // return posts.filter(
    //   ({ title, body }) =>
    //     title.toLowerCase().includes(args.query.toLowerCase()) ||
    //     body.toLowerCase().includes(args.query.toLowerCase())
    // );
  },
  users(parent, args, { prisma }, info) {
    return prisma.query.users(null, info);
  },
  post(parent, { id }, { posts }, info) {
    const post = posts.find((post) => post.id === id);
    if (!post) throw new Error("Post not found");
    return post;
  },
};

export default Query;
