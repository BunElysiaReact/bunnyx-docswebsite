FROM oven/bun:1.3.10
WORKDIR /app
COPY dist/ ./dist/
EXPOSE 3000
CMD ["bun", "dist/start.js"]