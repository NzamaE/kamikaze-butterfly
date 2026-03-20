import { Vendor, ServiceRequest, ChecklistItem, Metric } from "./types";

export const MOCK_VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Ethereal Blooms Florist',
    category: 'Florist',
    rating: 4.9,
    investment: 'Starting at $2,500',
    location: 'Cape Town, South Africa',
    description: 'We believe that flowers are the poetry of the earth. Our designs are inspired by the wild, untamed beauty of nature, curated for the modern visionary.',
    features: ['Custom Floral Design', 'On-site Installation', 'Seasonal Sourcing', 'Sustainable Practices'],
    image: 'https://picsum.photos/seed/flowers/800/600',
    portfolio: [
      'https://picsum.photos/seed/p1/400/400',
      'https://picsum.photos/seed/p2/400/400',
      'https://picsum.photos/seed/p3/400/400',
      'https://picsum.photos/seed/p4/400/400',
    ],
    availability: ['2026-06-15', '2026-06-22', '2026-07-05']
  },
  {
    id: '2',
    name: 'Wildflower & Vine',
    category: 'Catering',
    rating: 4.8,
    investment: 'Starting at $85/pp',
    location: 'Johannesburg, South Africa',
    description: 'Artisanal catering that tells a story. We focus on locally sourced ingredients and exquisite presentation.',
    features: ['Farm-to-Table', 'Custom Menus', 'Professional Staff', 'Wine Pairing'],
    image: 'https://picsum.photos/seed/food/800/600',
    portfolio: [
      'https://picsum.photos/seed/f1/400/400',
      'https://picsum.photos/seed/f2/400/400',
    ]
  }
];

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'req1',
    clientId: 'client1',
    vendorId: '1',
    serviceName: 'Full Wedding Floral Design',
    date: '2026-09-24',
    time: '14:00',
    status: 'pending',
    total: 3500,
    notes: 'We want a lot of proteas and fynbos.'
  }
];

export const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', title: 'Book Venue', category: 'Venue', completed: true },
  { id: 'c2', title: 'Hire Photographer', category: 'Photography', completed: true },
  { id: 'c3', title: 'Choose Floral Palette', category: 'Florist', completed: false, dueDate: '2026-04-15' },
  { id: 'c4', title: 'Finalize Guest List', category: 'Planning', completed: false, dueDate: '2026-05-01' },
];

export const VENDOR_METRICS: Metric[] = [
  { label: 'Total Earnings', value: '$12,450', change: 12, trend: 'up' },
  { label: 'Avg Rating', value: '4.9', change: 0.2, trend: 'up' },
  { label: 'Pending Requests', value: '8', change: -2, trend: 'down' },
  { label: 'Growth', value: '24%', change: 5, trend: 'up' },
];
