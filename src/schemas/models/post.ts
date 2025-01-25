import { builder } from "../builder";
import prisma from "../client";
import { formatSlug } from "../utils/strings";

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    author: t.relation("author"),
    authorId: t.exposeInt("authorId"),
    tags: t.exposeStringList("tags"),
    categories: t.relation("categories"),
    content: t.relation("content"),
  }),
});

builder.queryFields((t) => ({
  post: t.prismaField({
    type: "Post",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, root, { id }, ctx, info) =>
      prisma.post.findFirst({ ...query, where: { id } }),
  }),
  posts: t.prismaField({
    type: ["Post"],
    resolve: (query, root, args, ctx, info) =>
      prisma.post.findMany({ ...query }),
  }),
}));

builder.mutationFields((t) => ({
  createPost: t.prismaField({
    type: "Post",
    args: {
      tags: t.arg.stringList(),
      authorId: t.arg.int({ required: true }),
      categories: t.arg.stringList(),
    },
    resolve: async (
      query,
      parent,
      { tags, authorId, categories = [] },
      context
    ) => {
      const userExists = await prisma.user.findUnique({
        where: { id: authorId },
      });

      if (!userExists) {
        throw new Error(`User with ID ${authorId} does not exist`);
      }

      return prisma.post.create({
        ...query,
        data: {
          tags: tags ?? [],
          authorId,
          categories: {
            connectOrCreate: categories?.map((category) => ({
              where: { slug: category },
              create: { slug: formatSlug(category), label: category },
            })),
          },
        },
      });
    },
  }),
  updatePost: t.prismaField({
    type: "Post",
    args: {
      id: t.arg.int({ required: true }),
      tags: t.arg.stringList(),
      categories: t.arg.stringList(),
    },
    resolve: async (query, parent, { id, tags }, context) => {
      const postExists = await prisma.post.findUnique({
        where: { id },
      });

      if (!postExists) {
        throw new Error(`Post with ID ${id} does not exist`);
      }

      return prisma.post.update({
        ...query,
        where: { id },
        data: { tags: tags ?? postExists.tags },
      });
    },
  }),
  deletePost: t.prismaField({
    type: "Post",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, parent, { id }, context) => {
      const postExists = await prisma.post.findUnique({
        where: { id },
      });

      if (!postExists) {
        throw new Error(`Post with ID ${id} does not exist`);
      }

      return prisma.post.delete({
        ...query,
        where: { id },
      });
    },
  }),
}));
