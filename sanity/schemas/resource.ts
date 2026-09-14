import { defineType, defineField } from 'sanity';

export const resourceSchema = defineType({
  name: 'resource',
  title: 'Resource (PDF Guide)',
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
      name: 'description',
      title: 'Short Description / Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Mindset & Fundamentals', value: 'Mindset & Fundamentals' },
          { title: 'Myth Busting', value: 'Myth Busting' },
          { title: 'Career Paths', value: 'Career Paths' },
          { title: 'Action Plan', value: 'Action Plan' },
          { title: 'Terminology', value: 'Terminology' },
          { title: 'Resume & Strategy', value: 'Resume & Strategy' },
          { title: 'Networking', value: 'Networking' },
          { title: 'Interviewing', value: 'Interviewing' },
          { title: 'Insider Realities', value: 'Insider Realities' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stage',
      title: 'Transition Stage',
      type: 'string',
      description: 'Which of the 4 transition stages this guide belongs to.',
      options: {
        list: [
          { title: 'Stage 1: Exploration & Orientation', value: 'stage1' },
          { title: 'Stage 2: Asset Building & Language', value: 'stage2' },
          { title: 'Stage 3: Job Hunting & Outreach', value: 'stage3' },
          { title: 'Stage 4: Resilience & Reality', value: 'stage4' },
        ],
      },
      initialValue: 'stage1',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'weekNumber',
      title: 'Release Week Number',
      type: 'number',
      description: 'Sequence number (1-10) controlling weekly drop order.',
    }),
    defineField({
      name: 'requiresLogin',
      title: 'Requires Community Unlock?',
      type: 'boolean',
      description: 'If true, visitors must submit their email before downloading (guides 4+).',
      initialValue: false,
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Upload the downloadable PDF document here',
    }),
    defineField({
      name: 'externalPdfUrl',
      title: 'External PDF Link (Optional)',
      type: 'url',
      description: 'Use if hosted on Google Drive, Notion, or external CDN',
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size Label (e.g. 2.4 MB)',
      type: 'string',
    }),
    defineField({
      name: 'pageCount',
      title: 'Page Count Label (e.g. 12 Pages)',
      type: 'string',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Hex Color (Optional override)',
      type: 'string',
      description: 'Default rotates: #ff9fb0, #b52970, #ffcb00, #ff6051, #92d599, #5f9de3',
    }),
    defineField({
      name: 'isPublished',
      title: 'Is Published?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      week: 'weekNumber',
    },
    prepare({ title, subtitle, week }) {
      return {
        title,
        subtitle: week ? `Week ${week} · ${subtitle}` : subtitle,
      };
    },
  },
});
