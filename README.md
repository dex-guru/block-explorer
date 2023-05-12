## Dex.guru Block Explorer

This repo contains hackathon project for Block explorer. It's based on NextJs ans suppose to use Apollo GraphQL client to fetch the data.

## Development

Run the development server:

```bash
yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Docker

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://explorer-graph-stage.dexguru.biz -t block-explorer-guru ./
docker run -p 3000:3000 -e HOSTNAME='0.0.0.0' -e NEXT_PUBLIC_API_URL="https://explorer-graph-stage.dexguru.biz" blocks-explorer
```

## ENV VARS

set NEXT_PUBLIC_API_URL=https://explorer-graph-stage.dexguru.biz/
for backend API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
