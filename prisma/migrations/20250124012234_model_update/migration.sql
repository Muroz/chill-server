/*
  Warnings:

  - You are about to drop the `PostContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_postContentId_fkey";

-- DropForeignKey
ALTER TABLE "PostContent" DROP CONSTRAINT "PostContent_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostContent" DROP CONSTRAINT "PostContent_postId_fkey";

-- DropTable
DROP TABLE "PostContent";

-- CreateTable
CREATE TABLE "PostLocalization" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,

    CONSTRAINT "PostLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostLocalization_postId_locale_idx" ON "PostLocalization"("postId", "locale");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_postContentId_fkey" FOREIGN KEY ("postContentId") REFERENCES "PostLocalization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLocalization" ADD CONSTRAINT "PostLocalization_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLocalization" ADD CONSTRAINT "PostLocalization_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
