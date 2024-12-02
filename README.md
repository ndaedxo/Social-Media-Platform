# SocialSpark 🌟

SocialSpark is a modern social media application built with React and TypeScript that enables users to connect, share thoughts, and engage with others in a streamlined interface.

## Features ✨

- **User Authentication**: Simple username-based authentication system
- **Create Posts**: Share your thoughts with text content
- **Social Interactions**: Like and comment on posts
- **User Profiles**: Customizable profiles with bio and post history
- **Follow System**: Follow/unfollow other users
- **Real-time Feed**: View posts from users you follow
- **Search**: Find other users easily
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Technologies Used 🛠️

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: Local Storage (for demo purposes)

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ndaedxo/Social-Media-Platform.git
cd socialspark
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

## Project Structure 📁

```
src/
├── components/        # React components
├── context/          # Context providers
├── types/            # TypeScript interfaces
├── App.tsx           # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Key Components 🔑

- **Feed**: Displays posts from followed users
- **CreatePost**: Interface for creating new posts
- **Profile**: User profile management
- **Search**: User search functionality
- **PostCard**: Individual post display
- **Layout**: Main application layout
- **Navigation**: App navigation components

## State Management 🔄

The application uses React Context for state management:
- `AuthContext`: Handles user authentication and profile management
- `PostsContext`: Manages posts, likes, and comments

## Styling 🎨

- Modern and clean UI design
- Responsive layout
- Custom Tailwind components
- Smooth animations with Framer Motion
- Consistent color scheme and typography

## Local Storage 💾

The application uses browser's Local Storage to persist:
- User data
- Posts
- Authentication state
- User preferences

## Contributing 🤝

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 👤 Author

Ndaedzo Austin Mukhuba
- GitHub: [@ndaedzo](https://github.com/ndaedxo)
- LinkedIn: [Ndaedzo Austin Mukhuba](https://linkedin.com/in/ndaedzo-mukhuba-71759033b)
- Email: [ndaemukhuba](ndaemukhuba@gmail.com)
  

## License 📝

MIT License - feel free to use this project for learning or personal use.

## Acknowledgments 🙏

- React Team
- Tailwind CSS Team
- Framer Motion
- Lucide Icons
