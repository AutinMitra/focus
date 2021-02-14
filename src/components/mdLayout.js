/** @jsx jsx */
import { Heading, Button, Box, jsx } from 'theme-ui'
import { navigate } from 'gatsby'

const MdLayout = ({ children }) => {
  return (
    <Box
      sx={{
        p: 5,
        m: 'auto'
      }}
    >
      <Button
        onClick={() => {
          navigate('/')
        }}
      >
        Go Home
      </Button>
      <Box sx={{maxWidth: '1000px'}}>
        {children}
      </Box>
    </Box>
  )
}

export default MdLayout
