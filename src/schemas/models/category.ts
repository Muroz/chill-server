import { builder } from '../builder';
import prisma from '../client';
import { formatSlug } from '../utils/strings';

builder.prismaObject('Category', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    slug: t.exposeString('slug'),
    posts: t.relation('posts'),
    label: t.exposeString('label'),
  }),
});

builder.queryFields((t) => ({
  category: t.prismaField({
    type: 'Category',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, args) => {
      return prisma.category.findUnique({
        where: { id: args.id },
        ...query,
      });
    },
  }),
  categories: t.prismaField({
    type: ['Category'],
    resolve: (query) => {
      return prisma.category.findMany({
        ...query,
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createCategory: t.prismaField({
    type: 'Category',
    args: {
      slug: t.arg.string(),
      label: t.arg.string({ required: true }),
    },
    resolve: (query, _parent, { slug, label }) => {
      const slugValue = slug ?? formatSlug(label);
      return prisma.category.create({
        ...query,
        data: {
          slug: slugValue,
          label,
        },
      });
    },
  }),
  updateCategory: t.prismaField({
    type: 'Category',
    args: {
      id: t.arg.int({ required: true }),
      slug: t.arg.string(),
      label: t.arg.string(),
    },
    resolve: (query, _parent, { slug, label, id }) => {
      return prisma.category.update({
        where: { id },
        data: {
          ...(slug ? { slug } : {}),
          ...(label ? { label } : {}),
        },
        ...query,
      });
    },
  }),
  deleteCategory: t.prismaField({
    type: 'Category',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _parent, { id }) => {
      return prisma.category.delete({
        where: { id },
        ...query,
      });
    },
  }),
}));
