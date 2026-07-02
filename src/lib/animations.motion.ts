import { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};
export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.9,
      ease: 'easeOut',
    },
  },
};

export const slideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};
export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

/** Great for cards, buttons and icons. **/
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const zoomIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

/** creates a premium-looking entrance. */
export const blurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -8,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export const popIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 3,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};
