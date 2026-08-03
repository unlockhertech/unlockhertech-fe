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
        list: ['Luma', 'Eventbrite'],
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
      name: 'image',
      title: 'Event Banner',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});
