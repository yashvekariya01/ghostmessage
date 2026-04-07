# 👻 ghostmessage

**ghostmessage** is a premium, high-performance anonymous messaging platform. Built with **Next.js 14**, it offers a seamless and secure experience for users to receive honest feedback, thoughts, or questions while maintaining complete anonymity for the sender.


## ✨ Features

- **🔒 Anonymous Messaging**: Send and receive messages without revealing identities.
- **🤖 AI-Powered Suggestions**: Integrated with **OpenAI** to suggest creative and engaging message ideas.
- **📱 Dashboard**: A beautiful, minimalist dashboard to manage incoming messages in real-time.
- **🌑 Dark AMOLED Aesthetic**: A stunning, high-contrast dark theme inspired by Vercel/Geist design system.
- **⚡ Real-time Feedback**: Instant notifications and updates using a modern stack.
- **🛡️ Secure Auth**: Robust authentication powered by **NextAuth.js**.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **AI**: [OpenAI SDK](https://openai.com/)
- **Emails**: [Resend](https://resend.com/) & [React Email](https://react.email/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- MongoDB account (for database connection)
- OpenAI API Key (for message suggestions)
- Resend API Key (for verification emails)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ghostmessage.git
   cd ghostmessage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   OPENAI_API_KEY=your_openai_key
   RESEND_API_KEY=your_resend_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your app in action!

## 🧪 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the production bundle.
- `npm run start`: Starts the production server.
- `npm run lint`: Checks for linting errors.

## 📄 License

This project is licensed under the MIT License.

---
*Crafted with ❤️ by [yash vekariya]*
