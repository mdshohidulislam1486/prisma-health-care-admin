-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "appointtmentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "paymentGatewayData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_appointtmentId_key" ON "payment"("appointtmentId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_appointtmentId_fkey" FOREIGN KEY ("appointtmentId") REFERENCES "appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
