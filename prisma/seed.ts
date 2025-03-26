import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

async function main() {
  // Clean the database first
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});

  // Create events
  const event1 = await prisma.event.create({
    data: {
      creatorEns: 'andyoee.yodl.eth',
      creatorAddress: '0x3BEC0A9CeCAd6315860067325c603861adf740b5',
      title: 'Web3 Developer Meetup',
      description:
        'Join us for a night of networking and discussions about the latest in Web3 development. Topics include smart contracts, DeFi, and more.',
      eventTime: new Date(Date.now() + 7 * ONE_DAY), // One week from now
      location: 'Blockchain Hub, 123 Crypto St, San Francisco',
      capacity: 50,
      priceAmount: new Decimal('0.05'),
      priceCurrency: 'ETH',
      tags: ['web3', 'developer', 'blockchain', 'networking'],
      createdAt: new Date(Date.now() - 14 * ONE_DAY), // Created two weeks ago
      updatedAt: new Date(Date.now() - 14 * ONE_DAY),
    },
  });

  const event2 = await prisma.event.create({
    data: {
      creatorEns: 'andy.yodl.eth',
      creatorAddress: '0x250189C0Af7c0f4CD7871c9a20826eAee4c0a50c',
      title: 'NFT Art Exhibition',
      description:
        'Explore digital art in the metaverse. This virtual exhibition showcases works from top NFT artists and offers interactive experiences.',
      eventTime: new Date(Date.now() + 14 * ONE_DAY), // Two weeks from now
      location: 'Virtual - Metaverse Gallery',
      capacity: 100,
      priceAmount: new Decimal('10.00'),
      priceCurrency: 'USDC',
      tags: ['nft', 'art', 'metaverse', 'digital'],
      createdAt: new Date(Date.now() - 10 * ONE_DAY), // Created ten days ago
      updatedAt: new Date(Date.now() - 10 * ONE_DAY),
    },
  });

  // Create tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      eventId: event1.id,
      ownerEns: 'andy.yodl.eth',
      ownerAddress: '0x250189C0Af7c0f4CD7871c9a20826eAee4c0a50c',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      paid: true,
      createdAt: new Date(Date.now() - 7 * ONE_DAY),
      updatedAt: new Date(Date.now() - 7 * ONE_DAY),
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      eventId: event2.id,
      ownerEns: 'andyoee.yodl.eth',
      ownerAddress: '0x3BEC0A9CeCAd6315860067325c603861adf740b5',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      paid: false,
      createdAt: new Date(Date.now() - 5 * ONE_DAY),
      updatedAt: new Date(Date.now() - 5 * ONE_DAY),
    },
  });

  console.log('Database has been seeded!');
  console.log(`Created ${await prisma.event.count()} events`);
  console.log(`Created ${await prisma.ticket.count()} tickets`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
