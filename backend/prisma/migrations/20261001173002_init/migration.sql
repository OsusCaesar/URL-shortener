-- CreateTable
CREATE TABLE "URLs" (
    "id" SERIAL NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "originUrl" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "URLs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "URLs_shortUrl_key" ON "URLs"("shortUrl");
