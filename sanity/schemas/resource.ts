import { defineType, defineField } from 'sanity';

export const resourceSchema = defineType({
  name: 'resource',
  title: 'Resource',
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
      name: 'type',
      title: 'Resource Format Type',
      type: 'string',
      options: {
        list: [
          { title: 'PDF Guide / Playbook', value: 'guide' },
          { title: 'Template / Cheatsheet', value: 'template' },
          { title: 'Interactive Tool', value: 'tool' },
          { title: 'Video Workshop / Tutorial', value: 'video' },
          { title: 'Editorial Article / Deep Dive', value: 'article' },
        ],
      },
      initialValue: 'guide',
    }),
    defineField({
      name: 'topicCluster',
      title: 'High-Level Topic Domain',
      type: 'string',
      options: {
        list: [
          { title: 'Career Change', value: 'career-change' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'AI & Data', value: 'ai-data' },
          { title: 'Job Search', value: 'job-search' },
          { title: 'Leadership', value: 'leadership' },
        ],
      },
      initialValue: 'career-change',
    }),
    defineField({
      name: 'category',
      title: 'Specific Topic / Category',
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
          { title: 'System Design & Architecture', value: 'System Design & Architecture' },
          { title: 'Frontend & UI Engineering', value: 'Frontend & UI Engineering' },
          { title: 'Backend & Cloud Systems', value: 'Backend & Cloud Systems' },
          { title: 'AI & Machine Learning', value: 'AI & Machine Learning' },
          { title: 'Salary & Compensation', value: 'Salary & Compensation' },
          { title: 'Leadership & Management', value: 'Leadership & Management' },
          { title: 'Checklists & Templates', value: 'Checklists & Templates' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'level',
      title: 'Experience Level',
      type: 'string',
      options: {
        list: [
          { title: 'All Levels', value: 'All Levels' },
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
        ],
      },
      initialValue: 'All Levels',
    }),
    defineField({
      name: 'durationOrPages',
      title: 'Length / Duration / Page Count (e.g. "14 pages", "12 min watch", "Interactive tool")',
      type: 'string',
    }),
    defineField({
      name: 'actionLabel',
      title: 'Action Button Label (e.g. "Download PDF", "Open Tool", "Watch Video", "Read Article")',
      type: 'string',
    }),
    defineField({
      name: 'actionUrl',
      title: 'Action Target URL (External tool/video link or document)',
      type: 'url',
    }),
    defineField({
      name: 'collection',
      title: 'Collection / Track',
      type: 'string',
      description: 'Which track or collection this resource belongs to.',
      options: {
        list: [
          { title: 'Career Transition Toolkit (10-Guide Series)', value: 'career-toolkit' },
          { title: 'Technical & Engineering', value: 'tech-guides' },
          { title: 'AI & Data Systems', value: 'ai-data' },
          { title: 'Job Search & Negotiation', value: 'job-search' },
          { title: 'Leadership & Workplace', value: 'leadership' },
          { title: 'Templates & Cheatsheets', value: 'templates' },
        ],
      },
      initialValue: 'career-toolkit',
    }),
    defineField({
      name: 'format',
      title: 'Resource Format',
      type: 'string',
      options: {
        list: [
          { title: 'PDF Playbook / Guide', value: 'guide' },
          { title: 'Worksheet / Workbook', value: 'workbook' },
          { title: 'Cheatsheet / Checklist', value: 'cheatsheet' },
          { title: 'Template', value: 'template' },
        ],
      },
      initialValue: 'guide',
    }),
    defineField({
      name: 'targetLevel',
      title: 'Target Experience Level',
      type: 'string',
      options: {
        list: [
          { title: 'All Levels', value: 'All Levels' },
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
        ],
      },
      initialValue: 'All Levels',
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Searchable keywords (e.g. "System Design", "AWS", "Resume", "Salary")',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured / Spotlight Resource?',
      type: 'boolean',
      description: 'Show highlighted in the top spotlight banner.',
      initialValue: false,
    }),
    defineField({
      name: 'stage',
      title: 'Transition Stage (Career Toolkit Only)',
      type: 'string',
      description: 'Which of the 4 transition stages this guide belongs to (applicable for Career Toolkit).',
      options: {
        list: [
          { title: 'Stage 1: Exploration & Orientation', value: 'stage1' },
          { title: 'Stage 2: Asset Building & Language', value: 'stage2' },
          { title: 'Stage 3: Job Hunting & Outreach', value: 'stage3' },
          { title: 'Stage 4: Resilience & Reality', value: 'stage4' },
        ],
      },
      initialValue: 'stage1',
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
