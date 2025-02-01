// import { Prisma } from "@prisma/client";

import { builder } from '../builder';
import prisma from '../client';
// import { inferPrismaInput } from "../utils/prisma";

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name'),
    posts: t.relation('posts'),
    translations: t.relation('translations'),
    recipes: t.relation('recipes'),
  }),
});

builder.queryFields((t) => ({
  // Fetch all users
  users: t.prismaField({
    type: ['User'], // Array of User objects
    resolve: (query) => {
      return prisma.user.findMany({
        ...query,
      });
    },
  }),

  // Fetch a single user by ID or email
  user: t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      id: t.arg.int(),
      email: t.arg.string(),
    },
    resolve: async (query, _parent, { id, email }) => {
      if (!id && !email) {
        throw new Error(
          "You must provide either 'id' or 'email' to fetch a user."
        );
      }
      if (email === null) {
        throw new Error('Email cannot be null.');
      }
      return prisma.user.findUnique({
        ...query,
        where: id ? { id } : { email },
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  // Create a new user
  createUser: t.prismaField({
    type: 'User',
    args: {
      email: t.arg.string({ required: true }),
      name: t.arg.string(),
    },
    resolve: async (query, _parent, { email, name }) => {
      return prisma.user.create({
        ...query,
        data: {
          email,
          name,
        },
      });
    },
  }),

  // Update an existing user
  updateUser: t.prismaField({
    type: 'User',
    args: {
      id: t.arg.int({ required: true }),
      email: t.arg.string(),
      name: t.arg.string(),
    },
    resolve: async (query, _parent, { id, email, name }) => {
      if (email === null) {
        throw new Error('Email cannot be null.');
      }

      return prisma.user.update({
        ...query,
        where: { id },
        data: {
          email,
          name,
        },
      });
    },
  }),

  // Delete a user
  deleteUser: t.prismaField({
    type: 'User',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, { id }) => {
      return prisma.user.delete({
        ...query,
        where: { id },
      });
    },
  }),
}));
