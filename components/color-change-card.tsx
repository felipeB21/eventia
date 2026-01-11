"use client";
import { motion, Variants } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

interface EventData {
  title: string;
  description: string;
  imageUrl: string | null;
  id: string;
}

const ColorChangeCards = ({ event }: { event: EventData }) => {
  return (
    <div className="w-full">
      <Card
        heading={event.title}
        description={
          event.description || "Haz clic para ver más detalles del evento."
        }
        imgSrc={event.imageUrl ?? "https://placehold.net/600x600.png"}
      />
    </div>
  );
};

interface CardProps {
  heading: string;
  description: string;
  imgSrc: string;
}

const Card = ({ heading, description, imgSrc }: CardProps) => {
  return (
    <motion.div
      transition={{ staggerChildren: 0.035 }}
      whileHover="hover"
      className="group relative h-64 w-full  cursor-pointer overflow-hidden bg-slate-300"
    >
      <div
        className="absolute inset-0 saturate-100 transition-all duration-500 group-hover:scale-110 md:saturate-0 md:group-hover:saturate-100"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-20 flex h-full flex-col justify-between p-4 text-slate-300 transition-colors duration-500 group-hover:text-white">
        <FiArrowRight className="ml-auto text-3xl transition-transform duration-500 group-hover:-rotate-45" />
        <div>
          <h4>
            {heading.split("").map((letter, index) => (
              <AnimatedLetter letter={letter} key={index} />
            ))}
          </h4>
          <p>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface AnimatedLetterProps {
  letter: string;
}

const letterVariants: Variants = {
  hover: {
    y: "-50%",
  },
};

const AnimatedLetter = ({ letter }: AnimatedLetterProps) => {
  return (
    <div className="inline-block h-9 overflow-hidden font-semibold text-3xl">
      <motion.span
        className="flex min-w-1 flex-col"
        style={{ y: "0%" }}
        variants={letterVariants}
        transition={{ duration: 0.5 }}
      >
        <span>{letter}</span>
        <span>{letter}</span>
      </motion.span>
    </div>
  );
};

export default ColorChangeCards;
