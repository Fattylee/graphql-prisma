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
  },
  users(parent, args, { prisma }, info) {
    return prisma.query.users(null, info);
  },
  async post(parent, { id }, { prisma }, info) {
    return prisma.query.post(
      {
        where: {
          id,
        },
      },
      info
    );
  },
};

export default Query;
