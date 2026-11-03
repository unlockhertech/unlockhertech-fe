import { defineType, defineField, defineArrayMember } from 'sanity';

export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
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
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role / Tagline',
      type: 'string',
      description: 'e.g. Senior Software Engineer & Mentor',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author Avatar Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'authorBio',
      title: 'Author Bio',
      type: 'text',
      rows: 3,
      description: 'Short 2-3 sentence biography for the author spotlight box.',
    }),
    defineField({
      name: 'authorLinkedin',
      title: 'Author LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'body',
      title: 'Body (Rich Text)',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        }),
        defineArrayMember({
          name: 'callout',
          title: 'Callout Box',
          type: 'object',
          fields: [
            defineField({
              name: 'variant',
              title: 'Callout Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Did You Know?', value: 'didYouKnow' },
                  { title: 'Key Takeaway', value: 'keyTakeaway' },
                  { title: 'Pro Tip', value: 'tip' },
                  { title: 'Highlight', value: 'highlight' },
                ],
                layout: 'radio',
              },
              initialValue: 'didYouKnow',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Custom Heading (Optional)',
              type: 'string',
            }),
            defineField({
              name: 'content',
              title: 'Callout Content / Markdown',
              type: 'text',
              rows: 3,
              description: 'Body text or Markdown (supports - or * bullet points, and [links](url)).',
            }),
            defineField({
              name: 'points',
              title: 'Bullet Points (Optional)',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'List of bullet points to display inside the callout (supports markdown links).',
            }),
            defineField({
              name: 'referenceText',
              title: 'Reference / Source Label (Optional)',
              type: 'string',
              description: 'e.g. World Economic Forum 2026 or SheCanCode',
            }),
            defineField({
              name: 'referenceUrl',
              title: 'Reference / Source URL (Optional)',
              type: 'url',
              description: 'e.g. https://shecancode.io/...',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              variant: 'variant',
              content: 'content',
              points: 'points',
              referenceText: 'referenceText',
            },
            prepare({ title, variant, content, points, referenceText }) {
              const labelMap: Record<string, string> = {
                didYouKnow: '💡 Did You Know?',
                keyTakeaway: '✅ Key Takeaway',
                tip: '📌 Pro Tip',
                highlight: '✨ Highlight',
              };
              let previewSubtitle = content ? content.slice(0, 60) + '…' : '';
              if (!previewSubtitle && Array.isArray(points) && points.length > 0) {
                previewSubtitle = `• ${points[0]}${points.length > 1 ? ` (+${points.length - 1} more)` : ''}`;
              }
              if (referenceText) {
                previewSubtitle += ` [Ref: ${referenceText}]`;
              }
              return {
                title: title || labelMap[variant] || 'Callout Box',
                subtitle: previewSubtitle,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'pullQuote',
          title: 'Pull Quote',
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote Text',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'attribution',
              title: 'Attribution / Author',
              type: 'string',
            }),
            defineField({
              name: 'role',
              title: 'Role / Title',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              quote: 'quote',
              attribution: 'attribution',
            },
            prepare({ quote, attribution }) {
              return {
                title: quote ? `“${quote.slice(0, 50)}…”` : 'Empty Pull Quote',
                subtitle: attribution ? `— ${attribution}` : '',
              };
            },
          },
        }),
        defineArrayMember({
          name: 'captionedImage',
          title: 'Captioned Image',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Raw Markdown Content (Migration Fallback)',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      date: 'date',
      media: 'imageUrl',
    },
    prepare({ title, author, date, media }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '';
      return {
        title: title || 'Untitled Post',
        subtitle: [author, formattedDate].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
