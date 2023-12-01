import { Box, CircularProgress, Container } from "@mui/material";


const Loader = () => (
  <Container sx={{ py: "20vh" }} maxWidth="sm">
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  </Container>
);

export default Loader;
