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
  updateUser(parent, { id, data: { name, email, age } }, { users }, info) {
    const user = users.find((user) => user.id === id);
    if (!user) throw new Error("User not found");
    if (typeof email === "string") {
      if (
        users.some((user) => user.email.toLowerCase() === email.toLowerCase())
      )
        throw new Error("Email taken");
      user.email = email;
    }
    if (name) user.name = name;
    if (typeof age !== "undefined") user.age = age;

    return user;
  },
  updatePost(
    parent,
    { id, data: { title, body, published } = {} },
    { posts, pubsub }
  ) {
    let isTrue = false;
    const post = posts.find((post) => post.id === id);
    const originalPost = JSON.parse(JSON.stringify(post)); //deep copy
    if (!post) throw new Error("Post not found");

    if (title) {
      isTrue = true;
      post.title = title;
    }
    if (typeof body === "string" && body.length > 5) {
      isTrue = true;
      post.body = body;
    }
    if (typeof published === "boolean") {
      post.published = published;

      if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      } else if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      }
    } else if (post.published && isTrue) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }
    return post;
  },
  updateComment(parent, { id, data: { text } = {} }, { comments, pubsub }) {
    const comment = comments.find((comment) => comment.id === id);
    if (!comment) throw new Error("Comment not found");
    if (typeof text === "string" && text.length > 0) {
      comment.text = text;
      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: "UPDATED",
          data: comment,
        },
      });
    }
    return comment;
  },
};

export default Mutation;
