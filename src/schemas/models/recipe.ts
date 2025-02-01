import { builder } from '../builder';
import prisma from '../client';

builder.prismaObject('Recipe', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    author: t.relation('author'),
    authorId: t.exposeInt('authorId'),
    blocks: t.relation('blocks'),
    description: t.exposeString('description'),
    tags: t.exposeStringList('tags'),
    version: t.exposeString('version'),
    packageLink: t.exposeString('packageLink'),
    packageName: t.exposeString('packageName'),
    action: t.exposeString('action'),
  }),
});

builder.queryFields((t) => ({
  recipe: t.prismaField({
    type: 'Recipe',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, { id }) =>
      prisma.recipe.findUnique({
        ...query,
        where: { id },
      }),
  }),
  recipes: t.prismaField({
    type: ['Recipe'],
    resolve: (query) => prisma.recipe.findMany({ ...query }),
  }),
}));

builder.mutationFields((t) => ({
  createRecipe: t.prismaField({
    type: 'Recipe',
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string({ required: true }),
      authorId: t.arg.int({ required: true }),
      description: t.arg.string({ required: true }),
      tags: t.arg.stringList({ required: true }),
      version: t.arg.string({ required: true }),
      packageLink: t.arg.string({ required: true }),
      packageName: t.arg.string({ required: true }),
      action: t.arg.string({ required: true }),
    },
    resolve: (
      mutation,
      _parent,
      {
        title,
        content,
        authorId,
        description,
        tags,
        version,
        packageLink,
        packageName,
        action,
      }
    ) =>
      prisma.recipe.create({
        ...mutation,
        data: {
          title,
          content,
          authorId,
          description,
          tags,
          version,
          packageLink,
          packageName,
          action,
        },
      }),
  }),
  updateRecipe: t.prismaField({
    type: 'Recipe',
    args: {
      id: t.arg.int({ required: true }),
      title: t.arg.string(),
      content: t.arg.string(),
      description: t.arg.string(),
      tags: t.arg.stringList(),
      version: t.arg.string(),
      packageLink: t.arg.string(),
      packageName: t.arg.string(),
      action: t.arg.string(),
    },
    resolve: (
      mutation,
      _parent,
      {
        id,
        title,
        content,
        description,
        tags,
        version,
        packageLink,
        packageName,
        action,
      }
    ) =>
      prisma.recipe.update({
        ...mutation,
        where: { id },
        data: {
          ...(title ? { title } : {}),
          ...(content ? { content } : {}),
          ...(description ? { description } : {}),
          ...(tags ? { tags } : {}),
          ...(version ? { version } : {}),
          ...(packageLink ? { packageLink } : {}),
          ...(packageName ? { packageName } : {}),
          ...(action ? { action } : {}),
        },
      }),
  }),
  deleteRecipe: t.prismaField({
    type: 'Recipe',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (mutation, _parent, { id }) =>
      prisma.recipe.delete({
        ...mutation,
        where: { id },
      }),
  }),
}));
