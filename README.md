Kraftory is a "story-driven" e-commerce website for authentic handmade goods. Its core mission is to connect artisans directly with buyers, using an AI assistant to share craft knowledge and AR QR codes to link physical products directly to their video heritage stories.

**How It Works**

The project is a full-stack application with an Angular frontend and a Flask (Python) backend.

**For the Artisan (Seller)**

An artisan registers as a "Seller."

They go to their Seller Dashboard to add a new product.

They fill out the form with product details, images, contact info, and upload a heritage video.

The Flask backend saves the product info to the MongoDB database and stores the image and video files, saving their unique URLs (e.g., .../media/video.mp4).

**For the Customer (Buyer)**

A buyer registers or logs in.

They browse the products on the homepage.

When they click on a product, they go to the Product Detail Page.

If logged in, they can see the artisan's contact details and the AR QR Code.

When they scan the QR code with their phone, it opens a special AR viewer page. This page uses the phone's camera to "find" the QR code as a marker and plays the artisan's heritage video over it.

At any time, the user can click the AI chat bubble and ask a question (e.g., "What is Madhubani?"). The backend sends this question to the Google AI (Gemini), which generates an expert answer.
