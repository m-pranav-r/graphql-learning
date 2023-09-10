import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus'
import { NexusGenObjects } from '../../nexus-typegen'

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("description");
        t.nonNull.string("url");
    },
})

let links: NexusGenObjects["Link"][] = [
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
]

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            resolve(parent, args, context, info) {
                return links
            }
        })
        t.nonNull.list.nonNull.field("link", {
            type: "Link",
            args: {
                id: nonNull(intArg())
            },

            resolve(parent, args, context, info) {
                let { id } = args
                return links.filter(link => link.id === id)
            }
        })
    }
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
                const { description, url } = args

                let idCount = links.length + 1
                const link = {
                    id: idCount,
                    description: description,
                    url: url,
                }
                links.push(link)
                return link
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
                const { url, description, id } = args
                const link = links.filter(link => link.id === id)[0]
                if (!link) return ({ id: 1, url: "err", description: "err" })
                link.url = url
                if (description) link.description = description
                return link
            }
        })
        t.nonNull.field("deleteLink", {
            type: "Link",
            args: {
                id: nonNull(intArg()),
            },
            resolve(parent, args, context) {
                const { id } = args
                const link = links.filter(link => link.id === id)[0]
                links = links.filter(link => link.id !== id)
                return link ?? { id: -1, url: "null", description: "null" }
            }
        })
    }
})