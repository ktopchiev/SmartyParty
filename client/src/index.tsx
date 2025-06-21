import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './features/HomePage.tsx';
import { Provider } from 'react-redux';
import { store } from './services/store.ts';
import QuizRoomPage from './features/QuizRoomPage.tsx';
import { FinalPage } from './features/FinalPage.tsx';
import NotFoundPage from './features/NotFoundPage.tsx';
import ServerError from './errors/ServerError.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route index element={<HomePage />} />
          <Route path="quizroom/:roomId" element={<QuizRoomPage />} />
          <Route path="quizroom/:roomId/finale" element={<FinalPage />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="/not-found" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
)
