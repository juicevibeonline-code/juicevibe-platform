require('dotenv').config();
const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUrls() {
  const items = await prisma.menuItem.findMany({ select: { name: true, thumbnail: true } });
  console.log('Testing HTTP requests for', items.length, 'item thumbnails on http://localhost:3000...');
  
  for (const item of items) {
    if (!item.thumbnail) {
      console.log('❌ NULL thumbnail:', item.name);
      continue;
    }
    const url = 'http://localhost:3000' + item.thumbnail;
    await new Promise((resolve) => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ 200 OK: ' + item.name.padEnd(32) + ' -> ' + item.thumbnail);
        } else {
          console.log('❌ STATUS ' + res.statusCode + ': ' + item.name.padEnd(32) + ' -> ' + item.thumbnail);
        }
        resolve();
      }).on('error', (err) => {
        console.log('❌ ERR: ' + item.name.padEnd(32) + ' -> ' + err.message);
        resolve();
      });
    });
  }
  await prisma.$disconnect();
}

checkUrls();
