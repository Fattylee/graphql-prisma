import uuid from "uuid/v4";

const Mutation = {
  async deleteComment(parent, { id }, { prisma }, info) {
    const commentExist = await prisma.exists.Comment({ id });
    if (!commentExist) throw new Error("No comment found");
    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  deleteUser(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  createComment(parent, { data: { text, author, post } }, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: author,
            },
          },
          post: {
            connect: {
              id: post,
            },
          },
        },
      },
      info
    );
  },
  createPost(
    parent,
    { data: { title, body, published, author } },
    { prisma },
    info
  ) {
    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: {
            connect: {
              id: author,
            },
          },
        },
      },
      info
    );
  },
  createUser(parent, args, { prisma }, info) {
    return prisma.mutation.createUser(
      {
        data: {
          ...args.data,
        },
      },
      info
    );
  },
  async updateUser(parent, { id, data }, { prisma }, info) {
    const userExist = await prisma.exists.User({ id });
    if (!userExist) throw new Error("User not found");
    return prisma.mutation.updateUser(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
  async updatePost(parent, { id, data }, { prisma }, info) {
    const postExist = await prisma.exists.Post({ id });
    if (!postExist) throw new Error("Post not found");
    return prisma.mutation.updatePost(
      {
        data: data,
        where: { id },
      },
      info
    );
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    const commentExist = await prisma.exists.Comment({ id });
    if (!commentExist) throw new Error("Comment not found");
    return prisma.mutation.updateComment(
      {
        data: data,
        where: { id },
      },
      info
    );
  },
};

export default Mutation;
