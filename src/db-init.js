const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Seed the database with sellers, buyers,coinrate
  const sellerCreate = await prisma.seller.create({
    data: {
        sellerCoin:15,
        sellerMoney:120,
        sellerDepositCoin:10,
        sellerDepositMoney:100,
        sellerDepositCoinPrice:10
    },
  })
  const buyerCreate = await prisma.buyer.create({
    data: {
        buyerCoin:0,         
        buyerMoney:250,        
        buyerDepositMoney:0, 
        buyerDesiredCoin:10
    },
  })

  const coinRateCreate = await prisma.coinRate.create({
    data: {
        coinRate:10
    },
  })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
