import React, { useState } from 'react';
import { 
  Container, 
  Tabs, 
  Tab, 
  Box, 
  Typography,
  Paper,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Inventory, ShoppingCart } from '@mui/icons-material';
import InventoryView from './features/Inventory';
import BuyView from './features/Buy';

// Enhanced styled components
const GradientContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(145deg, #0e339b, #000)',
  paddingBlock: theme.spacing(3),
  position: 'relative',
  minWidth: '912px',
  maxWidth: 912,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: alpha('#ffffff', 0.1),
    backdropFilter: 'blur(10px)',
    zIndex: -1,
  }
}));

const ModernTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-root': {
    marginBottom: theme.spacing(4),
  },
  '& .MuiTab-root': {
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'none',
    color: 'rgba(255, 255, 255, 0.8)',
    minHeight: '70px',
    transition: 'all 0.3s ease',
    border: 'none',
    outline: 'none',
    '&:hover': {
      backgroundColor: alpha('#ffffff', 0.1),
    },
    '&.Mui-selected': {
      color: 'white',
      fontWeight: 'bold',
      outline: 'none'
    }
  },
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(45deg, #97abe0ff, #4ECDC4)',
    height: '4px',
    borderRadius: '2px',
  }
}));

const TabContainer = styled(Paper)(({ theme }) => ({
  background: alpha('#ffffff', 0.1),
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(4),
  border: `1px solid ${alpha('#ffffff', 0.2)}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  animation: 'fadeIn 0.8s ease-out',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

function App() {
  const [tab, setTab] = useState(0);


  return (
    <GradientContainer>
      <Container>
        <HeaderBox>
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold', 
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            🍫 Chocolate Vending Machine
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: alpha('#ffffff', 0.8),
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Premium chocolate selection at your fingertips
          </Typography>
        </HeaderBox>

        <Container >
          <TabContainer elevation={0}>
            <ModernTabs 
              value={tab} 
              onChange={(_, v) => setTab(v)} 
              centered
              variant="fullWidth"
            >
              <Tab 
                icon={<Inventory />} 
                label="Inventory" 
                iconPosition="start"
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem',
                    mr: 1
                  }
                }}
              />
              <Tab 
                icon={<ShoppingCart />} 
                label="Buy" 
                iconPosition="start"
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem',
                    mr: 1
                  }
                }}
              />
            </ModernTabs>
          </TabContainer>
        </Container>

        <Box sx={{ mt: 4 }}>
          {tab === 0 && <InventoryView />}
          {tab === 1 && <BuyView />}
        </Box>
      </Container>
    </GradientContainer>
  );
}

export default App;