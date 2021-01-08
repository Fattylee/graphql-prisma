const Subscription = {
  comment: {
    subscribe(parent, { postId: id }, { prisma }) {
      return prisma.subscription.comment();
    },
  },
  post: {
    subscribe(parent, args, { prisma }) {
      return prisma.subscription.post();
    },
  },
  user: {
    subscribe(arent, args, { prisma }, info) {
      return prisma.subscription.user(null, info);
    },
  },
};

export default Subscription;
