# 💬 AI Chat App

A modern **React Native** chat application built with **Expo**, featuring OTP-based authentication, onboarding flow, and AI-powered conversation simulation.  
Built with ❤️ by [Sabbukrishna](https://github.com/sabbukrishna)

---

## ✨ Features

- 📱 **OTP Login** (mocked for demo: use `1234` as OTP)
- 🎯 **Onboarding flow** after first login
- 💬 **Chat UI** ready to integrate with AI backend
- 🌓 Dark theme design
- 📦 State management with `AuthContext`
- ⚡ Built with [Expo Router](https://expo.github.io/router/) for navigation

---

## 📦 Install dependencies

```bash
npm install
# or
yarn install
```

---

## 🚀 Run the app

```bash
npx expo start
```

---

## 📱 Open in device/emulator

- Press **`i`** for iOS Simulator (Mac only)  
- Press **`a`** for Android Emulator  
- Scan the QR code in Expo Go app (iOS/Android)

---

## 🔐 Environment Variables

If integrating with a backend or OTP service, create a `.env` file in the root:

```env
API_BASE_URL=https://api.example.com
OTP_SERVICE_KEY=your_service_key
```

Load them using [expo-constants](https://docs.expo.dev/versions/latest/sdk/constants/) or [react-native-dotenv](https://www.npmjs.com/package/react-native-dotenv).

---

## 📂 Project Structure

```
chatapp/
│
├── app/
│   ├── index.tsx          # Login screen
│   ├── onboarding.tsx     # Onboarding flow
│   ├── chat.tsx           # Main chat UI
│
├── contexts/
│   └── AuthContext.tsx    # Authentication & onboarding state
│
├── assets/                # Images, fonts, icons
├── screenshots/           # Screenshots for README
├── .env                   # Environment variables (ignored in git)
├── package.json
└── README.md
```

---

## 🖼 Screenshots

| Login Screen | OTP Verification | Onboarding | Chat Screen |
|--------------|------------------|------------|-------------|
| ![Login](./screenshots/login.PNG) | ![OTP](./screenshots/otp.png) | ![Onboarding](./screenshots/onboarding.png) | ![Chat](./screenshots/chat.png) |

---

## 🧑‍💻 Development Notes

- OTP verification is mocked for demo purposes (**`1234`** as default code).  
- `AuthContext` handles login state and onboarding completion.  
- After login, the app checks `hasCompletedOnboarding` before routing to chat.  
- Assistant responses are simulated for now — ready to connect with a backend microservice.

---

## 🛠 Tech Stack

- **React Native** with **Expo**
- **Expo Router** for navigation
- **Lucide React Native** for icons
- **Context API** for authentication
- **TypeScript** for type safety

---

## 📜 License

MIT License © 2025 [Sabbukrishna](https://github.com/sabbukrishna)
