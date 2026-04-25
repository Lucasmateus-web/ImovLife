import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { SearchCard } from "../components/SearchCard";
import videoBg from "../../../../assets/inicial360.mp4";

export const HomeScreen = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0f172a] antialiased selection:bg-[#5b89a6]/30">
      <div className="fixed inset-0 z-0 bg-[#0f172a]">
        <video
          autoPlay loop muted playsInline
          className="h-full w-full object-cover opacity-70 md:scale-110 lg:translate-x-10 lg:scale-125"
        >
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 w-full bg-gradient-to-r from-[#0f172a] via-[#0f172a]/95 to-transparent lg:w-[75%]" />
        <div className="absolute inset-0 bg-[#0f172a]/40 lg:hidden" />
      </div>

      <div className="relative z-20 flex min-h-screen w-full flex-col">
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
          className="flex flex-1 items-end px-4 pb-8 pt-28 sm:px-6 sm:pb-12 sm:pt-32 md:items-center lg:px-20 lg:py-24"
        >
          <div className="w-full max-w-xl">
            <SearchCard />
          </div>
        </motion.main>
      </div>
    </div>
  );
};
