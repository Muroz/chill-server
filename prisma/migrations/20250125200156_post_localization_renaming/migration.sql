/*
  Warnings:

  - You are about to drop the column `postContentId` on the `Block` table. All the data in the column will be lost.
  - Added the required column `postLocalizationId` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_postContentId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "postContentId",
ADD COLUMN     "postLocalizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_postLocalizationId_fkey" FOREIGN KEY ("postLocalizationId") REFERENCES "PostLocalization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
