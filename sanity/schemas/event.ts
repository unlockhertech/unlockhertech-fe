import { defineType, defineField } from 'sanity';

export const eventSchema = defineType({
  name: 'event',
  title: 'External Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: ['Luma', 'Eventbrite', 'Conference', 'Website', 'External'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'urlOrId',
      title: 'Event ID or Full URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discountCode',
      title: 'Discount / Promo Code',
      type: 'string',
      description: 'Optional promo code (e.g. UNLOCKHERTECH20-F056D5212AE7) displayed for attendees',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button CTA Label',
      type: 'string',
      description: 'Custom button label, e.g. "Get Tickets (20% Off)"',
    }),
    defineField({
      name: 'isPartner',
      title: 'Community Partner Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Event Banner',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});

