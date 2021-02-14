/** @jsx jsx */
import { Button, Box, jsx } from 'theme-ui'
import { navigate } from 'gatsby'
import { fadeInUp } from '../animation/animations'
import { motion } from 'framer-motion'

const MdLayout = ({ children }) => {
  return (
    <Box
      sx={{
        p: 5,
        m: 'auto',
      }}
    >
      <Button
        onClick={() => {
          navigate('/')
        }}
      >
        Go Home
      </Button>
      <motion.div variants={fadeInUp()}>
        <Box sx={{ maxWidth: '1000px' }}>{children}</Box>
      </motion.div>
    </Box>
  )
}

export default MdLayout
