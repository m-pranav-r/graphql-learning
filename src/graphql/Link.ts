import { arg, extendType, intArg, nonNull, objectType, stringArg } from 'nexus'
import { Prisma } from '@prisma/client';

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("description");
        t.nonNull.string("url");
    },
})

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            resolve(parent, args, context) {
                return context.prisma.link.findMany()
            }
        })
    },
})

export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },

            resolve(parent, args, context) {
                const newLink = context.prisma.link.create({
                    data: {
                        description: args.description,
                        url: args.url,
                        createdAt: new Date().toISOString()
                    }
                })
                return newLink
            }
        })

        t.nonNull.field("updateLink", {
            type: "Link",
            args: {
                id: nonNull(intArg()),
                url: nonNull(stringArg()),
                description: stringArg(),
            },
            resolve(parent, args, context) {
                let { id: reqId, description: reqDesc, url: reqUrl } = args
                reqDesc = reqDesc ?? ""
                const link = context.prisma.link.update({
                    where: {
                        id: reqId
                    },
                    data: {
                        url: reqUrl,
                        description: reqDesc
                    }
                })
                return link
            }
        })
        t.nonNull.field("deleteLink", {
            type: "Link",
            args: {
                id: nonNull(intArg()),
            },
            resolve(parent, args, context) {
                return context.prisma.link.delete({
                    where: {
                        id: args.id
                    }
                })
            }
        })
    }
})