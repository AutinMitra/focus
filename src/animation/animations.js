export const fadeInUp = ({duration, y} = {}) => ({
  initial: {
    y: y ?? 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration,
    }
  },
  exit: {
    y: y ?? 20,
    opacity: 0,
  }
})

export const staggerAnimation = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
