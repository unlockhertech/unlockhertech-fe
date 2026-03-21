import { describe, it, expect } from 'vitest';
import { parseRssFeed } from '../app/hooks/useRssFeed';
import { JSDOM } from 'jsdom';

const RSS_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
        <channel>
                <title>Test Podcast</title>
                <itunes:image href="https://example.com/channel.jpg"/>
                <item>
                        <title>Episode 1</title>
                        <itunes:image href="https://example.com/episode1.jpg"/>
                        <itunes:duration>01:00:00</itunes:duration>
                        <itunes:episode>1</itunes:episode>
                        <pubDate>Thu, 19 Mar 2026 19:23:06 GMT</pubDate>
                        <description>Test Description</description>
                        <enclosure url="https://example.com/audio.mp3" length="123" type="audio/mpeg"/>
                </item>
                <item>
                        <title>Episode 2</title>
                        <itunes:duration>00:30:00</itunes:duration>
                        <itunes:episode>2</itunes:episode>
                        <pubDate>Fri, 20 Mar 2026 19:23:06 GMT</pubDate>
                        <description>Test Description 2</description>
                        <enclosure url="https://example.com/audio2.mp3" length="123" type="audio/mpeg"/>
                </item>
        </channel>
</rss>`;

describe('parseRssFeed', () => {
  it('correctly extracts episode-specific images and channel-level images', () => {
    const parser = new (new JSDOM().window).DOMParser();
    const xmlDoc = parser.parseFromString(RSS_SAMPLE, 'text/xml');
    
    const episodes = parseRssFeed(xmlDoc);
    
    expect(episodes).toHaveLength(2);
    
    // First episode has its own itunes:image
    expect(episodes[0].imageUrl).toBe('https://example.com/episode1.jpg');
    
    // Second episode has no its own image, so it should fall back to channel image
    expect(episodes[1].imageUrl).toBe('https://example.com/channel.jpg');
  });

  it('correctly extracts from standard <image><url> if itunes:image is missing', () => {
    const RSS_STANDARD = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0">
        <channel>
                <image><url>https://example.com/standard-channel.jpg</url></image>
                <item>
                        <title>Episode 1</title>
                        <enclosure url="https://example.com/audio.mp3" length="123" type="audio/mpeg"/>
                </item>
        </channel>
    </rss>`;
    const parser = new (new JSDOM().window).DOMParser();
    const xmlDoc = parser.parseFromString(RSS_STANDARD, 'text/xml');
    const episodes = parseRssFeed(xmlDoc);
    expect(episodes[0].imageUrl).toBe('https://example.com/standard-channel.jpg');
  });
});
