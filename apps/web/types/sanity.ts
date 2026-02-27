export interface SanitySlug {
    current: string;
}

export interface SanityImage {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
}

export interface SanityImageWithAlt extends SanityImage {
    alt?: string;
    caption?: string;
}

export interface Work {
    _id: string;
    title: string;
    slug: SanitySlug;
    category: string;
    year: string;
    tags?: string[];
    description?: string;
    image?: SanityImage;
    body?: unknown[];
    gallery?: SanityImageWithAlt[];
    liveUrl?: string;
    githubUrl?: string;
}

export interface BlogPost {
    _id: string;
    title: string;
    slug: SanitySlug;
    date: string;
    excerpt?: string;
    body?: unknown[];
    coverImage?: SanityImage;
}


export interface PersonalInfo {
    _id: string;
    name: string;
    tagline?: string;
    bio?: string;
    email: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
}

export interface AboutInfo {
    _id: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: SanityImage;
    resume?: {
        asset: {
            url: string;
        }
    };
}
