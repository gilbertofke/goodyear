FROM mcr.microsoft.com/playwright:v1.51.0-focal

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Install Playwright browsers
RUN npx playwright install chromium

# Command to run the script
CMD ["npx", "ts-node", "scrape-tires.ts"]
