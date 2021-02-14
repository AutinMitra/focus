/** @jsx jsx */
import { Flex, Styled, jsx } from 'theme-ui'
import { AnimatePresence, motion } from 'framer-motion'
import { SettingsProvider } from '../context/settings.context'

// Taken from my personal site
const Layout = ({ location, children, ...props }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.main
        initial='initial'
        animate='animate'
        exit={{ opacity: 0 }}
        key={location.pathname}
        sx={{
          height: '100vh',
        }}
      >
        <Styled.root {...props}>
          <Flex
            sx={{
              minHeight: '100vh',
              height: '100%',
            }}
          >
            <SettingsProvider>{children}</SettingsProvider>
          </Flex>
        </Styled.root>
      </motion.main>
    </AnimatePresence>
  )
}

export default Layout
