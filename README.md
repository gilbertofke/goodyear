# Goodyear Tire Scraper

A robust web scraping solution that extracts tire information from Goodyear's website using Playwright.

## Project Overview

This project demonstrates modern web scraping techniques using TypeScript and Playwright. It extracts detailed tire information including sizes, specifications, and pricing from Goodyear's website.

### Why Playwright?

Playwright was chosen for this project for several key reasons:
- **Reliable Automation**: Handles modern web apps with dynamic content effectively
- **Cross-browser Support**: Works across multiple browser engines
- **Built-in Wait Mechanisms**: Intelligent auto-waiting for elements
- **Network Interception**: Ability to handle and modify network requests
- **TypeScript Support**: First-class TypeScript support for better type safety

## Output Data

The scraper generates:
- `tire_data.json`: Structured tire data including:
  - Product information
  - Available sizes
  - Rim diameters
  - Pricing
  - Timestamp of scraping
- `tire_page.png`: Screenshot of the scraped page for verification

## Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd good-tire-scraper
   ```

2. **Build the Docker image:**
   ```bash
   docker build -t tire-scraper .
   ```

3. **Run the scraper:**
   ```bash
   docker run -v $(pwd):/app tire-scraper
   ```

The output files will be available in your current directory.

## Local Development Setup

If you prefer running without Docker:

1. **Prerequisites:**
   - Node.js (v16 or later)
   - npm

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Run the scraper:**
   ```bash
   npx ts-node scrape-tires.ts
   ```

## Project Structure

```
good-tire-scraper/
├── scrape-tires.ts    # Main scraping script
├── package.json       # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── Dockerfile        # Docker configuration
└── README.md         # Documentation
```

## Technical Details

- **Language**: TypeScript
- **Main Dependencies**:
  - Playwright: Web automation
  - ts-node: TypeScript execution
- **Output Format**: JSON with structured tire data
- **Error Handling**: Comprehensive error logging to `scraping_error.log`

## Best Practices Implemented

1. **Robust Error Handling**: All operations are wrapped in try-catch blocks
2. **Type Safety**: Full TypeScript implementation with interfaces
3. **Data Validation**: Structured data validation before saving
4. **Documentation**: Comprehensive inline comments and README
5. **Containerization**: Docker support for easy deployment

## License

MIT

## Author

[Your Name]
