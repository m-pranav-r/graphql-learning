import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function populateTest() {
    const user = await prisma.link.create({
        data: {
            createdAt: '2021-11-16T21:48:39.798Z',
            description: 'Fullstack tutorial for GraphQL',
            url: 'www.howtographql.com'
        },
    })
}

async function main() {
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

main()
    .catch((r) => {
        throw r
    })
    .finally(async () => {
        await prisma.$disconnect
    })