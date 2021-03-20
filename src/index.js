const express = require('express')
const bodyParser = require('body-parser')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()

app.use(bodyParser.json())


app.get('/sellers', async (req, res) => {
  const result = await prisma.seller.findMany()
  res.json(result)
})

app.get('/buyers', async (req, res) => {
  const result = await prisma.buyer.findMany()
  res.json(result)
})


app.get(`/buyer/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.buyer.findFirst({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.get(`/seller/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.seller.findFirst({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.post(`/seller/create`, async (req, res) => {

  const { sellerCoin, sellerMoney, sellerDepositCoin,sellerDepositCoinPrice } = req.body
  const result = await prisma.seller.create({
    data: {
      sellerCoin,
      sellerMoney,
      sellerDepositCoin,
      sellerDepositCoinPrice,
      // author: { connect: { email: authorEmail } },
    },
  })
  res.json(result)
})
app.post(`/buyer/create`, async (req, res) => {

  const { buyerCoin, buyerMoney, buyerDepositMoney,buyerDesiredCoin } = req.body
  const result = await prisma.buyer.create({
    data: {
      buyerCoin,         
      buyerMoney,        
      buyerDepositMoney, 
      buyerDesiredCoin
    },
  })
  res.json(result)
})

app.post(`/sell/:sellerId/coin/:coinUnit`, async (req, res) => {
  const { sellerId,coinUnit } = req.params

  // const { sellerCoin, sellerMoney, sellerDepositCoin,sellerDepositCoinPrice } = req.body
  const {coinRate} = await prisma.coinRate.findFirst()
  const sellerResult = await prisma.seller.findFirst({
    where: {
      id: parseInt(sellerId),
    },
  })

  const { sellerCoin, sellerMoney, sellerDepositCoin,sellerDepositCoinPrice,sellerDepositMoney } = sellerResult

  const newSellerCoin = parseInt(sellerCoin) - parseInt(coinUnit)
  const newSellerDepositCoin = parseInt(coinUnit) *  parseInt(coinRate)


  const newSellerDepositMoney = parseInt(sellerMoney) + parseInt(newSellerDepositCoin)
  const result = await prisma.seller.update({
    where: {
      id: parseInt(sellerId),
    },
    data: {
      sellerCoin:newSellerCoin,
      // sellerMoney,
      sellerDepositMoney:newSellerDepositMoney,
      sellerDepositCoin:newSellerDepositCoin,
      sellerDepositCoinPrice:coinRate
      
    },
  })
  res.json(result)
})

app.post(`/buy/:buyerId/coin/:coinUnits/seller/:sellerId`, async (req, res) => {
  const { buyerId,coinUnits,sellerId } = req.params

  const {coinRate} = await prisma.coinRate.findFirst()
  const buyerResult = await prisma.buyer.findFirst({
    where: {
      id: parseInt(buyerId),
    },
  })

  const { buyerCoin, buyerMoney, buyerDepositMoney,buyerDesiredCoin } = buyerResult
  const newbuyerDepositMoney = parseInt(coinUnits) *  parseInt(coinRate)
  const newbuyerMoney = parseInt(buyerMoney) - newbuyerDepositMoney
  // Seller find update 
  const sellerResult = await prisma.seller.findFirst({
    where: {
      id: parseInt(sellerId),
    },
  })

  const { sellerCoin, sellerMoney, sellerDepositCoin,sellerDepositCoinPrice,sellerDepositMoney } = sellerResult
  const resultSeller = await prisma.seller.update({
    where: {
      id: parseInt(sellerId),
    },
    data: {
      sellerCoin: parseInt(sellerDepositCoin),
      sellerMoney: parseInt(sellerMoney) + parseInt(sellerDepositMoney),
      sellerDepositMoney:0,
      sellerDepositCoin:0,
      sellerDepositCoinPrice:coinRate
      
    },
  })
  const resultBuyer = await prisma.buyer.update({
    where: {
      id: parseInt(buyerId),
    },
    data: {
      buyerCoin:parseInt(coinUnits),         
      buyerMoney:newbuyerMoney,        
      // buyerDepositMoney:newbuyerDepositMoney, 
      // buyerDesiredCoin:parseInt(coinUnits)
    },
  })
  res.json(resultBuyer)
})
const server = app.listen(3000, () =>
  console.log(
    '🚀 Server ready at: http://localhost:3000\n⭐️',
  ),
)
