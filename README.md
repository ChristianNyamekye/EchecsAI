## Echecs AI Project

Echecs AI is a chess analysis platform that leverages the power of the Stockfish chess engine and OpenAI API for enhanced analysis, hosted using Google Cloud Functions, with a user interface built on Next.js and deployed on Vercel. The project aims to provide users with detailed chess analysis and optimal move suggestions.


### Table of Contents

- [Getting Started](#getting-started)

- [Prerequisites](#prerequisites)

- [Installation](#installation)

- [Configuration](#configuration)

- [Usage](#usage)

- [Deployment](#deployment)

  - [Deploying Next.js to Vercel](#deploying-nextjs-to-vercel)

  - [Deploying Google Cloud Function](#deploying-google-cloud-function)

- [Project Structure](#project-structure)

- [Contributing](#contributing)

- [License](#license)

### Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

- [Vercel CLI](https://vercel.com/download)

- [OpenAI API Key](https://beta.openai.com/signup/)

### Installation

1\. **Clone the repository:**

   ```bash

   git clone https://github.com/ChristianNyamekye/EchecsAI.git

   cd EchecsAI

   ```

2\. **Install dependencies:**

   ```bash

   npm install

   ```

### Configuration

1\. **Google Cloud Function Setup:**

   - Ensure the Google Cloud SDK is installed and authenticated.

   - Create a new Google Cloud project and link it with a billing account.

   - Enable the Cloud Functions API.

   - Upload the Stockfish binary to your project directory.

2\. **Environment Variables:**

   - Create a `.env.local` file in the root directory of your Next.js project.

   - Add the following environment variables:

     ```

     NEXT_PUBLIC_GCLOUD_FUNCTION_URL=https://REGION-PROJECT_ID.cloudfunctions.net/analyzeChessPosition
     OPENAI_API_KEY=your_openai_api_key

     ```
3\. **OpenAI API Setup:**

  -   Sign up for an OpenAI API key from [OpenAI](https://beta.openai.com/signup/).

### Usage

1\. **Start the development server:**

   ```bash

   npm run dev

   ```

   - Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

### Deployment

#### Deploying Next.js to Vercel

1\. **Login to Vercel:**

   ```bash

   vercel login

   ```

2\. **Deploy the application:**

   ```bash

   vercel

   ```

   Follow the prompts to link your Vercel project and deploy the application.

#### Deploying Google Cloud Function

1\. **Navigate to the function directory:**

   ```bash

   cd path/to/your/function

   ```

2\. **Deploy the function:**

   ```bash

   gcloud functions deploy analyzeChessPosition

     --runtime nodejs18

     --trigger-http

     --memory 256MB

     --timeout 300s

     --region us-central1

     --project YOUR_PROJECT_ID

   ```

### Project Structure

```

EchecsAI/

├── public/

│   ├── stockfish/

│   │   └── stockfish (binary)

├── src/

│   ├── components/

│   ├── pages/

│   │   └── api/

│   │       └── best-move.js

│   └── styles/

├── .env.local

├── package.json

├── README.md

└── gcloud-function/

    ├── index.js

    ├── package.json

    └── .gcloudignore

```

### Contributing

We welcome contributions to the Echecs AI project. Please follow these steps to contribute:

1\. Fork the repository.

2\. Create a new branch (`git checkout -b feature/YourFeature`).

3\. Make your changes.

4\. Commit your changes (`git commit -am 'Add new feature'`).

5\. Push to the branch (`git push origin feature/YourFeature`).

6\. Create a new Pull Request.

### License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) file for details.

---


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
