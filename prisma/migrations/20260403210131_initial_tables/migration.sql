-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "emoji" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "counterPartyName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
