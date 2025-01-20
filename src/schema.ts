import { PrismaClient, Prisma } from "@prisma/client";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";

import type PrismaTypes from "@pothos/plugin-prisma/generated";

const prisma = new PrismaClient();

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

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

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    posts: t.relation("posts"),
    translations: t.relation("translations"),
    recipes: t.relation("recipes"),
  }),
});

builder.prismaObject("PostContent", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    post: t.relation("post"),
    postId: t.exposeInt("postId"),
    title: t.exposeString("title"),
    content: t.relation("content"),
    summary: t.exposeString("summary"),
    author: t.relation("author"),
    authorId: t.exposeInt("authorId"),
    locale: t.exposeString("locale"),
  }),
});

builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    posts: t.relation("posts"),
    label: t.exposeString("label"),
    icon: t.exposeString("icon"),
  }),
});

const blockTypes = builder.enumType("BlockTypes", {
  values: ["TEXT", "IMAGE", "VIDEO", "CODE", "QUOTE", "RECIPE"],
});

builder.prismaObject("Block", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    postContent: t.relation("postContent"),
    postContentId: t.exposeInt("postContentId"),
    type: t.expose("type", { type: blockTypes }),
    content: t.exposeString("content"),
    recipe: t.relation("recipe", { nullable: true }),
    recipeId: t.exposeInt("recipeId", { nullable: true }),
  }),
});

builder.prismaObject("Recipe", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content", { nullable: true }),
    author: t.relation("author"),
    authorId: t.exposeInt("authorId"),
    blocks: t.relation("blocks"),
    description: t.exposeString("description"),
    tags: t.exposeStringList("tags"),
    version: t.exposeString("version"),
    package: t.exposeString("package"),
    action: t.exposeString("action"),
  }),
});

builder.queryType({
  fields: (t) => ({
    post: t.prismaField({
      type: "Post",
      resolve: (query, root, args, ctx, info) =>
        prisma.post.findFirst({ ...query }),
    }),
    posts: t.prismaField({
      type: ["Post"],
      resolve: (query, root, args, ctx, info) =>
        prisma.post.findMany({ ...query }),
    }),
    user: t.prismaField({
      type: "User",
      resolve: (query, root, args, ctx, info) =>
        prisma.user.findFirst({ ...query }),
    }),
    users: t.prismaField({
      type: ["User"],
      resolve: (query, root, args, ctx, info) =>
        prisma.user.findMany({ ...query }),
    }),
    postContent: t.prismaField({
      type: "PostContent",
      resolve: (query, root, args, ctx, info) =>
        prisma.postContent.findFirst({ ...query }),
    }),
    postContents: t.prismaField({
      type: ["PostContent"],
      resolve: (query, root, args, ctx, info) =>
        prisma.postContent.findMany({ ...query }),
    }),
    category: t.prismaField({
      type: "Category",
      resolve: (query, root, args, ctx, info) =>
        prisma.category.findFirst({ ...query }),
    }),
    categories: t.prismaField({
      type: ["Category"],
      resolve: (query, root, args, ctx, info) =>
        prisma.category.findMany({ ...query }),
    }),
    block: t.prismaField({
      type: "Block",
      resolve: (query, root, args, ctx, info) =>
        prisma.block.findFirst({ ...query }),
    }),
    blocks: t.prismaField({
      type: ["Block"],
      resolve: (query, root, args, ctx, info) =>
        prisma.block.findMany({ ...query }),
    }),
    recipe: t.prismaField({
      type: "Recipe",
      resolve: (query, root, args, ctx, info) =>
        prisma.recipe.findFirst({ ...query }),
    }),
    recipes: t.prismaField({
      type: ["Recipe"],
      resolve: (query, root, args, ctx, info) =>
        prisma.recipe.findMany({ ...query }),
    }),
  }),
});

// function inferPrismaInput<T extends object>(name: string, prismaInput: T, builder: InstanceType<typeof SchemaBuilder<{ PrismaTypes: PrismaTypes }>>) {
//     return builder.inputRef<T>(name).implement({
//       fields: (t) => {
//         const fields: any = {};
//         for (const [key, type] of Object.entries(prismaInput)) {
//           if (typeof type === "string") {
//             fields[key] = t.string({ required: true });
//           } else if (typeof type === "number") {
//             fields[key] = t.int({ required: true });
//           } // Add additional type mappings as needed
//         }
//         return fields;
//       },
//     });
//   }

// const PostCreateInput = inferPrismaInput("PostCreateInput", Prisma.PostCreateInput, builder);

// builder.mutationType({
//     fields: (t) => ({
//         createPost: t.prismaField({
//             type: "Post",
//             // args: {
//             //     data: t.arg({ type: "PostCreateInput" }),
//             // },
//             resolve: (query, root, args, ctx, info) => prisma.post.create({
//                 ...query,
//                 data: args,
//             }),
//         }),
//         createUser: t.prismaField({
//             type: "User",
//             args: {
//                 data: t.arg({ type: "UserCreateInput" }),
//             },
//             resolve: (query, root, args, ctx, info) => prisma.user.create({
//                 ...query,
//                 data: args.data,
//             }),
//         }),
//         createPostContent: t.prismaField({
//             type: "PostContent",
//             args: {
//                 data: t.arg({ type: "PostContentCreateInput" }),
//             },
//             resolve: (query, root, args, ctx, info) => prisma.postContent.create({
//                 ...query,
//                 data: args.data,
//             }),
//         }),
//         createCategory: t.prismaField({
//             type: "Category",
//             args: {
//                 data: t.arg({ type: "CategoryCreateInput" }),
//             },
//             resolve: (query, root, args, ctx, info) => prisma.category.create({
//                 ...query,
//                 data: args.data,
//             }),
//         }),
//         createBlock: t.prismaField({
//             type: "Block",
//             args: {
//                 data: t.arg({ type: "BlockCreateInput" }),
//             },
//             resolve: (query, root, args, ctx, info) => prisma.block.create({
//                 ...query,
//                 data: args.data,
//             }),
//         }),
//         createRecipe: t.prismaField({
//             type: "Recipe",
//             args: {
//                 data: t.arg({ type: "RecipeCreateInput" }),
//             },
//             resolve: (query, root, args, ctx, info) => prisma.recipe.create({
//                 ...query,
//                 data: args.data,
//             }),
//         }),
//     }),
// });
export const schema = builder.toSchema();
