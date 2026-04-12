import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { SearchCard } from "../components/SearchCard";
import videoBg from "../../../../assets/inicial360.mp4";

export const HomeScreen = () => {
  const location = useLocation();

  return (
    <div className="relative h-screen w-full bg-[#0f172a] antialiased selection:bg-[#5b89a6]/30 overflow-hidden">
      
      <div className="fixed inset-0 z-0 bg-[#0f172a]">
        <video
          autoPlay loop muted playsInline
          className="h-full w-full object-cover scale-125 translate-x-10 opacity-70"
        >
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/95 to-transparent w-full lg:w-[75%]" />
        <div className="absolute inset-0 bg-[#0f172a]/40 lg:hidden" />
      </div>

      <div className="relative z-20 flex flex-col h-full w-full">
        <Header />

        <motion.main 
          key={location.key}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ 
            duration: 1.3, 
            delay: 0.1, 
            ease: [0.34, 1.56, 0.64, 1] 
          }}
          className="flex-1 flex items-center px-6 lg:px-20 py-24"
        >
          <div className="w-full max-w-xl">
            <SearchCard />
          </div>
        </motion.main>
      </div>
    </div>
  );
};