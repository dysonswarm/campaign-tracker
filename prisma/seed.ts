import { Prisma, PrismaClient } from "@prisma/client";
import { LoremIpsum } from "lorem-ipsum";
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});
const prisma = new PrismaClient();
const initialPosts: Prisma.PostCreateInput[] = [];
for (let i = 2; i <= 100; i++) {
  initialPosts.push({
    title: "Post " + i,
    slug: "post-" + i,
    content: lorem.generateParagraphs(3),
    author: { connect: { id: "clxql13hl00009s9msqyt6wdf" } },
  });
}

async function main() {
  console.log(`Start seeding ...`);

  for (const post of initialPosts) {
    const newPost = await prisma.post.create({
      data: post,
    });
    console.log(`Created post with id: ${newPost.id}`);
  }

  console.log(`Seeding finished.`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
