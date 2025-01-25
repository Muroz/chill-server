import { builder } from "../builder";
import prisma from "../client";

const blockTypes = builder.enumType("BlockTypes", {
  values: ["TEXT", "IMAGE", "VIDEO", "CODE", "QUOTE", "RECIPE"],
});

builder.prismaObject("Block", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    postLocalization: t.relation("postLocalization"),
    postLocalizationId: t.exposeInt("postLocalizationId"),
    type: t.expose("type", { type: blockTypes }),
    content: t.exposeString("content"),
    recipe: t.relation("recipe", { nullable: true }),
    recipeId: t.exposeInt("recipeId", { nullable: true }),
  }),
});

builder.queryFields((t) => ({
  block: t.prismaField({
    type: "Block",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, args, _context, _info) => {
      return prisma.block.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  }),
  blocks: t.prismaField({
    type: ["Block"],
    resolve: (query, _parent, _args, _context, _info) => {
      return prisma.block.findMany({ ...query });
    },
  }),
  blocksByPost: t.prismaField({
    type: ["Block"],
    args: {
      postLocalizationId: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, { postLocalizationId }, _context, _info) => {
      return prisma.block.findMany({
        ...query,
        where: { postLocalizationId },
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createBlock: t.prismaField({
    type: "Block",
    args: {
      postLocalizationId: t.arg.int({ required: true }),
      type: t.arg({ type: blockTypes, required: true }),
      content: t.arg.string({ required: true }),
      recipeId: t.arg.int(),
    },
    resolve: (
      query,
      _parent,
      { postLocalizationId, type, content, recipeId },
      _context,
      _info
    ) => {
      return prisma.block.create({
        ...query,
        data: {
          postLocalizationId,
          type,
          content,
          ...(recipeId ? { recipeId } : {}),
        },
      });
    },
  }),
  updateBlock: t.prismaField({
    type: "Block",
    args: {
      id: t.arg.int({ required: true }),
      postLocalizationId: t.arg.int(),
      type: t.arg({ type: blockTypes }),
      content: t.arg.string(),
      recipeId: t.arg.int(),
    },
    resolve: (
      query,
      _parent,
      { id, postLocalizationId, type, content, recipeId },
      _context,
      _info
    ) => {
      return prisma.block.update({
        ...query,
        where: { id },
        data: {
          ...(postLocalizationId ? { postLocalizationId } : {}),
          ...(type ? { type } : {}),
          ...(content ? { content } : {}),
          ...(recipeId ? { recipeId } : {}),
        },
      });
    },
  }),
  deleteBlock: t.prismaField({
    type: "Block",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, { id }, _context, _info) => {
      return prisma.block.delete({
        ...query,
        where: { id },
      });
    },
  }),
}));
