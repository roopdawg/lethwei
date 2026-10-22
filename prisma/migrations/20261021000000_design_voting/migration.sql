-- AlterTable
ALTER TABLE "Design" ADD COLUMN     "aiTiebreakReason" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDesignJudge" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DesignVote" (
    "id" TEXT NOT NULL,
    "batchLabel" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesignVote_batchLabel_voterId_key" ON "DesignVote"("batchLabel", "voterId");

-- AddForeignKey
ALTER TABLE "DesignVote" ADD CONSTRAINT "DesignVote_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignVote" ADD CONSTRAINT "DesignVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

