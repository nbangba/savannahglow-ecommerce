import React from 'react'
import { useSiteMetadata } from '../hooks/use-site-metadata'

interface SEOProps {
    title: string
    description: string
    image: string
    children: JSX.Element | JSX.Element[]
    pathname: string
}

export default function SEO({
    title,
    description,
    pathname,
    children,
}: SEOProps) {
    const {
        title: defaultTitle,
        description: defaultDescription,
        image,
        siteUrl,
    } = useSiteMetadata()

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: `${siteUrl}${image}`,
        url: `${siteUrl}/${pathname || ``}`,
    }

    return (
        <>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={seo.url} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:url" content={seo.url} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />
            {/*<meta name="twitter:creator" content={seo.twitterUsername} />*/}
            {children}
        </>
    )
}
