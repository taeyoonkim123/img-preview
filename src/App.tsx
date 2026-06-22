import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageGallery from './pages/ImageGallery';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smt" element={<ImageGallery />} />
      </Routes>
    </BrowserRouter>
  );
}

