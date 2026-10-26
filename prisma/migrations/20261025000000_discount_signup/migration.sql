-- CreateTable
CREATE TABLE "DiscountSignup" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT,
    "discountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscountSignup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountSignup_email_key" ON "DiscountSignup"("email");

