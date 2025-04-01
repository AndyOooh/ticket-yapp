import { PrismaClient } from '@prisma/client';
import { generateValidationToken } from '../src/lib/utils';

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
      priceAmount: 0.05,
      priceCurrency: 'EUR',
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
      priceAmount: 0.02,
      priceCurrency: 'USD',
      tags: ['nft', 'art', 'metaverse', 'digital'],
      createdAt: new Date(Date.now() - 10 * ONE_DAY), // Created ten days ago
      updatedAt: new Date(Date.now() - 10 * ONE_DAY),
    },
  });

  // Create Vitalik's event
  const vitalikEvent = await prisma.event.create({
    data: {
      creatorEns: 'vitalik.eth',
      creatorAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      title: 'Ethereum 2.0 Discussion',
      description:
        'Join us for an in-depth discussion about Ethereum 2.0, its roadmap, and implications for developers and users.',
      eventTime: new Date(Date.now() + 10 * ONE_DAY),
      location: 'Eth Foundation HQ, Zug',
      capacity: 200,
      priceAmount: 0.01,
      priceCurrency: 'CHF',
      tags: ['ethereum', 'eth2', 'blockchain', 'development'],
      createdAt: new Date(Date.now() - 5 * ONE_DAY),
      updatedAt: new Date(Date.now() - 5 * ONE_DAY),
    },
  });

  // Create Yodl's event
  const yodlEvent = await prisma.event.create({
    data: {
      creatorEns: 'yodl.eth',
      creatorAddress: '0x3Fbe48F4314f6817B7Fe39cdAD635E8Dd12ab299',
      title: 'Web3 Payments Workshop',
      description:
        'Learn how to integrate cryptocurrency payments into your applications with this hands-on workshop.',
      eventTime: new Date(Date.now() + 5 * ONE_DAY),
      location: 'Online - Zoom',
      capacity: 75,
      priceAmount: 15.0,
      priceCurrency: 'USD',
      tags: ['payments', 'web3', 'cryptocurrency', 'workshop'],
      createdAt: new Date(Date.now() - 3 * ONE_DAY),
      updatedAt: new Date(Date.now() - 3 * ONE_DAY),
    },
  });

  // Create tickets with validation tokens
  const ticket1 = await prisma.ticket.create({
    data: {
      eventId: event1.id,
      ownerEns: 'andy.yodl.eth',
      ownerAddress: '0x250189C0Af7c0f4CD7871c9a20826eAee4c0a50c',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      chainId: 8453, // Base
      paid: true,
      validationToken: generateValidationToken(),
      redeemed: false,
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
      chainId: 10, // Optimism
      paid: false,
      validationToken: generateValidationToken(),
      redeemed: false,
      createdAt: new Date(Date.now() - 5 * ONE_DAY),
      updatedAt: new Date(Date.now() - 5 * ONE_DAY),
    },
  });

  // Vitalik's ticket for Yodl's event
  const vitalikTicket = await prisma.ticket.create({
    data: {
      eventId: yodlEvent.id,
      ownerEns: 'vitalik.eth',
      ownerAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      txHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
      chainId: 137, // Polygon
      paid: true,
      validationToken: generateValidationToken(),
      redeemed: false,
      createdAt: new Date(Date.now() - 2 * ONE_DAY),
      updatedAt: new Date(Date.now() - 2 * ONE_DAY),
    },
  });

  // Yodl's ticket for Vitalik's event
  const yodlTicket = await prisma.ticket.create({
    data: {
      eventId: vitalikEvent.id,
      ownerEns: 'yodl.eth',
      ownerAddress: '0x3Fbe48F4314f6817B7Fe39cdAD635E8Dd12ab299',
      txHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      chainId: 42161, // Arbitrum
      paid: true,
      validationToken: generateValidationToken(),
      redeemed: true, // This ticket has already been used
      createdAt: new Date(Date.now() - 3 * ONE_DAY),
      updatedAt: new Date(Date.now() - 1 * ONE_DAY), // Updated recently (when redeemed)
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
