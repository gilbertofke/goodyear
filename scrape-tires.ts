import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';

interface TireSize {
    size: string;
    width: string;
    aspectRatio: string;
    construction: string;
    diameter: string;
    productId: string;
    specs: {
        url: string;
        fullUrl: string;
    };
}

interface TireData {
    productInfo: {
        name: string;
        baseProductId: string;
        priceRange: string;
    };
    availableSizes: {
        rimDiameters: {
            [key: string]: {
                value: string;
                specs: {
                    url: string;
                    fullUrl: string;
                }
            }
        };
        tireSizes: {
            [key: string]: TireSize
        }
    };
    metadata: {
        scrapedUrl: string;
        scrapedAt: string;
        scrapedTimestamp: number;
        timezone: string;
        counts: {
            rimDiameters: number;
            tireSizes: number;
        }
    };
}

async function scrapeTireData() {
    let browser: Browser | null = null;

    try {
        browser = await chromium.launch({ headless: false });
        const page: Page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 800 });

        const url = 'https://www.goodyear.com/en_US/tires/assurance-weatherready-2/24987.html';
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        console.log('Page loaded, beginning data extraction...');
        await page.waitForTimeout(5000);

        // Extract base product info
        const productInfo = await page.evaluate(() => {
            // Try multiple possible selectors for price
            const priceSelectors = [
                '[data-testid="pds-pricing"]',
                '.product-price',
                '.price-range',
                '[data-qa="product-price"]',
                '.product-sales-price',
                '.price'
            ];

            let priceElement = null;
            for (const selector of priceSelectors) {
                priceElement = document.querySelector(selector);
                if (priceElement) break;
            }

            const titleElement = document.querySelector('h1');
            
            // Clean up the price text
            let priceText = priceElement?.textContent?.trim() || 'Price not found';
            priceText = priceText.replace(/\s+/g, ' ').trim(); // Remove extra whitespace
            if (priceText.includes('ea')) {
                priceText = priceText.replace('ea', '').trim() + ' each';
            }
            
            return {
                name: titleElement?.textContent?.trim() || 'Product name not found',
                priceRange: priceText,
                baseProductId: '24987' // Extracted from the URL
            };
        });

        console.log('Product info extracted:', productInfo);

        // Extract rim diameters
        const rimDiameters = await page.evaluate(() => {
            const diameters: Record<string, any> = {};
            document.querySelectorAll('div.radio-button-variation.mr-8.mt-8.position-relative input[name="rimDiameter"]').forEach(input => {
                const element = input as HTMLInputElement;
                const size = element.value;
                diameters[size] = {
                    value: element.getAttribute('data-value') || '',
                    specs: {
                        url: element.getAttribute('data-url') || '',
                        fullUrl: element.getAttribute('value') || ''
                    }
                };
            });
            return diameters;
        });

        // Extract tire sizes with parsed components
        const tireSizes = await page.evaluate(() => {
            const sizes: Record<string, any> = {};
            document.querySelectorAll('div.radio-button-variation.mr-8.mt-8.position-relative input[name="tireSizeCode"]').forEach(input => {
                const element = input as HTMLInputElement;
                const sizeText = element.id;
                // Parse size components (e.g., "235/65R18")
                const match = sizeText.match(/^(\d+)\/(\d+)R(\d+)$/);
                if (match) {
                    sizes[sizeText] = {
                        size: sizeText,
                        width: match[1],
                        aspectRatio: match[2],
                        construction: 'R',
                        diameter: match[3],
                        productId: element.getAttribute('value')?.split('pid=')[1] || '',
                        specs: {
                            url: element.getAttribute('data-url') || '',
                            fullUrl: element.getAttribute('value') || ''
                        }
                    };
                }
            });
            return sizes;
        });

        // Create the structured data object
        const tireData: TireData = {
            productInfo,
            availableSizes: {
                rimDiameters,
                tireSizes
            },
            metadata: {
                scrapedUrl: url,
                scrapedAt: new Date().toISOString(),
                scrapedTimestamp: Math.floor(Date.now() / 1000),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                counts: {
                    rimDiameters: Object.keys(rimDiameters).length,
                    tireSizes: Object.keys(tireSizes).length
                }
            }
        };

        // Save the data
        fs.writeFileSync('tire_data.json', JSON.stringify(tireData, null, 2));
        console.log('Data saved to tire_data.json');

        // Take a screenshot for verification
        await page.screenshot({ path: 'tire_page.png', fullPage: true });
        console.log('Full page screenshot saved as tire_page.png');

    } catch (error: any) {
        console.error('An error occurred:', error);
        fs.writeFileSync('scraping_error.log', `Error at ${new Date().toISOString()}\n${error.stack || error}`);
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed');
        }
    }
}

// Run the scraper
scrapeTireData();