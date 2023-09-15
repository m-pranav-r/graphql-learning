import { objectType } from "nexus"
import { NexusObjectTypeDef } from "nexus/dist/core"
import { NexusGenObjects } from "../../nexus-typegen"

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id")
        t.nonNull.string("name")
        t.nonNull.string("email")
        t.nonNull.list.nonNull.field("links", {
            type: "Link",
            async resolve(parent, args, context) {
                console.log("Resolving links...")
                let links = context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .links()
            },
        })
    }
})