import { HostawayApiResponse } from '../interfaces/hostaway.interface';

export const mockHostawayReviews: HostawayApiResponse = {
  status: 'success',
  result: [
    {
      id: 7453,
      type: 'host-to-guest',
      status: 'published',
      rating: 4.75,
      publicReview:
        'Shane and family are wonderful! Would definitely host again :)',
      reviewCategory: [
        { category: 'cleanliness', rating: 5 },
        { category: 'communication', rating: 5 },
        { category: 'respect_house_rules', rating: 5 },
      ],
      submittedAt: '2020-08-21 22:45:14',
      guestName: 'Shane Finkelstein',
      listingName: '2B N1 A - 29 Shoreditch Heights',
    },
    {
      id: 7454,
      type: 'guest-to-host',
      status: 'published',
      rating: 4.0,
      publicReview:
        'A cozy place, good location, but had a minor issue with the Wi-Fi. Overall, a pleasant stay.',
      reviewCategory: [
        { category: 'cleanliness', rating: 4.5 },
        { category: 'communication', rating: 4.0 },
        { category: 'location', rating: 4.5 },
        { category: 'value', rating: 3.5 },
      ],
      submittedAt: '2021-03-15 10:30:00',
      guestName: 'Alice Smith',
      listingName: 'Beautiful Pimlico Flat near Victoria Station',
    },
    {
      id: 7455,
      type: 'guest-to-host',
      status: 'published',
      rating: 5.0,
      publicReview:
        'Absolutely fantastic! The place was spotless, communication was great, and the location was perfect for exploring London.',
      reviewCategory: [
        { category: 'cleanliness', rating: 5 },
        { category: 'communication', rating: 5 },
        { category: 'location', rating: 5 },
        { category: 'value', rating: 5 },
      ],
      submittedAt: '2022-01-20 14:00:00',
      guestName: 'Bob Johnson',
      listingName: 'Spacious 2 Bed Apartment in Hoxton',
    },
    {
      id: 7456,
      type: 'guest-to-host',
      status: 'published',
      rating: 3.5,
      publicReview:
        'The apartment was okay, but a bit noisy at night. Host was responsive.',
      reviewCategory: [
        { category: 'cleanliness', rating: 3.5 },
        { category: 'communication', rating: 4.5 },
        { category: 'location', rating: 4.0 },
        { category: 'noise', rating: 2.0 },
      ],
      submittedAt: '2022-05-01 18:00:00',
      guestName: 'Charlie Brown',
      listingName: 'Luxury Centre Apartment in Waterloo',
    },
    {
      id: 7457,
      type: 'guest-to-host',
      status: 'published',
      rating: 4.5,
      publicReview:
        'Lovely stay, very comfortable and well-equipped. Would recommend.',
      reviewCategory: [
        { category: 'cleanliness', rating: 4.5 },
        { category: 'amenities', rating: 4.5 },
        { category: 'comfort', rating: 4.5 },
      ],
      submittedAt: '2023-02-10 09:15:00',
      guestName: 'Diana Prince',
      listingName: 'Riverside Studio Flat in Canary Wharf',
    },
    {
      id: 7458,
      type: 'guest-to-host',
      status: 'published',
      rating: 3.25,
      publicReview:
        "The location was great, but the apartment felt a bit dated. Some appliances weren't working.",
      reviewCategory: [
        { category: 'location', rating: 4.5 },
        { category: 'amenities', rating: 2.5 },
        { category: 'cleanliness', rating: 3.0 },
      ],
      submittedAt: '2023-07-22 11:40:00',
      guestName: 'Clark Kent',
      listingName: 'Comfortable 2 Bed Apartment near Tower Bridge',
    },
    {
      id: 7459,
      type: 'guest-to-host',
      status: 'published',
      rating: 4.25,
      publicReview:
        'Good value for money. The host was helpful, and the apartment was clean.',
      reviewCategory: [
        { category: 'value', rating: 4.5 },
        { category: 'communication', rating: 4.0 },
        { category: 'cleanliness', rating: 4.5 },
      ],
      submittedAt: '2024-01-05 16:00:00',
      guestName: 'Lois Lane',
      listingName: 'Bright 1 Bed Flat on Vibrant Brick Lane',
    },
    {
      id: 7460,
      type: 'guest-to-host',
      status: 'published',
      rating: 4.5,
      publicReview:
        'Beautifully decorated flat with excellent amenities. Enjoyed my stay.',
      reviewCategory: [
        { category: 'decor', rating: 5 },
        { category: 'amenities', rating: 4.5 },
        { category: 'comfort', rating: 4.0 },
      ],
      submittedAt: '2024-03-10 12:00:00',
      guestName: 'Bruce Wayne',
      listingName: 'Charming 2 Bed Flat with Garden in Canonbury',
    },
    {
      id: 7461,
      type: 'guest-to-host',
      status: 'published',
      rating: 4.75,
      publicReview: 'Exceptional stay! Modern, clean, and perfectly located.',
      reviewCategory: [
        { category: 'cleanliness', rating: 5 },
        { category: 'location', rating: 4.5 },
        { category: 'modern_amenities', rating: 5 },
      ],
      submittedAt: '2024-03-15 14:30:00',
      guestName: 'Peter Parker',
      listingName: 'Modern Studio in Angel',
    },
    {
      id: 7462,
      type: 'host-to-guest',
      status: 'published',
      rating: 4.0,
      publicReview: 'Great guest, maintained the property well.',
      reviewCategory: [
        { category: 'cleanliness', rating: 4.0 },
        { category: 'communication', rating: 4.0 },
        { category: 'respect_house_rules', rating: 4.0 },
      ],
      submittedAt: '2024-03-20 09:45:00',
      guestName: 'Tony Stark',
      listingName: 'Luxury Penthouse in Mayfair',
    },
  ],
};
