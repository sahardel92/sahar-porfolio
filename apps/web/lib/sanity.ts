import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImage, Work, BlogPost, PersonalInfo, AboutInfo } from '../types/sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}

export async function getWorks(): Promise<Work[]> {
  return client.fetch(`*[_type == "work"] | order(year desc) {
    _id, title, slug, category, year, tags, description, image
  }`);
}

export async function getWork(slug: string): Promise<Work | null> {
  const results = await client.fetch(`*[_type == "work" && slug.current == $slug][0] {
    _id, title, slug, category, year, tags, description, image,
    body[] {
      ...,
      _type == "image" => { ..., asset-> }
    },
    gallery[] { ..., asset-> },
    liveUrl, githubUrl
  }`, { slug });
  return results ?? null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(`*[_type == "post"] | order(date desc) {
    _id, title, slug, date, excerpt, coverImage
  }`);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const results = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, date, excerpt, body, coverImage
  }`, { slug });
  return results ?? null;
}



export async function getPersonalInfo(): Promise<PersonalInfo | null> {
  const results = await client.fetch(`*[_type == "personalInfo"][0] {
    _id, name, tagline, bio, email, github, twitter, linkedin
  }`);
  return results ?? null;
}

export async function getAbout(): Promise<AboutInfo | null> {
  const results = await client.fetch(`*[_type == "about"][0] {
    _id, title, subtitle, description, image,
    resume {
      asset->{
        url
      }
    }
  }`);
  return results ?? null;
}
