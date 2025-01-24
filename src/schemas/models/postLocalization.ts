import { builder } from "../builder";
import prisma from "../client";

builder.prismaObject("PostLocalization", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    post: t.relation("post"),
    postId: t.exposeInt("postId"),
    title: t.exposeString("title"),
    // content: t.relation("content"),
    summary: t.exposeString("summary"),
    author: t.relation("author"),
    authorId: t.exposeInt("authorId"),
    locale: t.exposeString("locale"),
  }),
});

builder.queryFields((t) => ({
  postLocalization: t.prismaField({
    type: "PostLocalization",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, args, ctx) =>
      prisma.postLocalization.findUnique({
        ...query,
        where: { id: args.id },
      }),
  }),
  postLocalizations: t.prismaField({
    type: ["PostLocalization"],
    resolve: (query, _parent, _args, ctx) =>
      prisma.postLocalization.findMany({ ...query }),
  }),
}));

builder.mutationFields((t) => ({
  createPostLocalization: t.prismaField({
    type: "PostLocalization",
    args: {
      postId: t.arg.int({ required: true }),
      title: t.arg.string({ required: true }),
      summary: t.arg.string({ required: true }),
      authorId: t.arg.int({ required: true }),
      locale: t.arg.string({ required: true }),
    },
    resolve: (
      query,
      _parent,
      { postId, title, summary, authorId, locale },
      ctx
    ) =>
      prisma.postLocalization.create({
        ...query,
        data: {
          postId,
          title,
          summary,
          authorId,
          locale,
        },
      }),
  }),
  updatePostLocalization: t.prismaField({
    type: "PostLocalization",
    args: {
      id: t.arg.int({ required: true }),
      title: t.arg.string(),
      summary: t.arg.string(),
      locale: t.arg.string(),
    },
    resolve: (query, _parent, { id, title, summary, locale }, ctx) =>
      prisma.postLocalization.update({
        ...query,
        where: { id },
        data: {
          ...(title ? { title } : {}),
          ...(summary ? { summary } : {}),
          ...(locale ? { locale } : {}),
        },
      }),
  }),
  deletePostLocalization: t.prismaField({
    type: "PostLocalization",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, { id }, ctx) =>
      prisma.postLocalization.delete({
        ...query,
        where: { id },
      }),
  }),
}));
