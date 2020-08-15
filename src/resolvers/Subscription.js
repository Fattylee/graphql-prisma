const Subscription = {
  comment: {
    subscribe(parent, { postId: id }, { prisma }) {
      return prisma.subscription.comment();
      // const post = posts.find((post) => post.id === id && post.published);
      // if (!post) throw new Error("Post not found");
      // return pubsub.asyncIterator(`comment ${id}`);
    },
  },
  post: {
    subscribe(parent, args, { pubsub }) {
      return pubsub.asyncIterator("post");
    },
  },
};

export default Subscription;
