import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityNotifications from './pages/PriorityNotifications';

// A sleek, modern theme with a clean white background
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    background: {
      default: '#f8f9fa', // Clean, subtle off-white background
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 12, // Softer, modern edges
  }
});

// A small custom component to handle active tab styling
const NavButton = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Button 
      component={Link} 
      to={to} 
      sx={{ 
        color: isActive ? 'primary.main' : 'text.secondary',
        bgcolor: isActive ? 'primary.50' : 'transparent',
        px: 2,
        mx: 0.5,
        '&:hover': {
          bgcolor: isActive ? 'primary.50' : 'grey.100',
        }
      }}
    >
      {children}
    </Button>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* Sleek, sticky white Navbar */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Container maxWidth="md">
            <Toolbar disableGutters sx={{ minHeight: '64px' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary', letterSpacing: '-0.5px' }}>
                Campus Alerts
              </Typography>
              <Box display="flex">
                <NavButton to="/">All</NavButton>
                <NavButton to="/priority">Priority</NavButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        <Container maxWidth="sm" sx={{ mt: 5, mb: 8 }}>
          <Routes>
            <Route path="/" element={<AllNotifications />} />
            <Route path="/priority" element={<PriorityNotifications />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
