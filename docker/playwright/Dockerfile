FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /google-search-crawler

COPY . .

RUN npx playwright@1.46.0 install chromium

CMD ["node", "./dist/index.js"]
