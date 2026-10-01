import type { APIRoute } from "astro";

export const GET: APIRoute = async ({params}) => {
    const response = await fetch(`${import.meta.env.WPGRAPHQL_URL}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            query: `
            query AllProperties {
            properties(first: 9999) {
                nodes {
                databaseId
                featuredImage {
                    node {
                    sourceUrl
                    mediaDetails {
                        width
                        height
                    }
                    }
                }
                title
                uri
                propertyDetails {
                    bathrooms
                    bedrooms
                    price
                }
                }
            }
            }
            `
        })
    });
    const {data} = await response.json();
    return new Response(JSON.stringify({properties: data.properties.nodes}))
};