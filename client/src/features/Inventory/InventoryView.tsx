import  { useEffect, useState } from 'react';
import { getInventory, restockChocolate } from '../../api/vendingApi';
import AppButton from '../../components/AppButton';
import AppSnackbar from '../../components/AppSnackbar';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Grid,
  Paper,
  Chip,
  Fade,
  Grow,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Inventory, AttachMoney, Refresh } from '@mui/icons-material';
import type { Chocolate } from '../../api/vendingApi';

// Styled components
const CashCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #185a9d, #185a9d)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: '20px',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.025)',
  }
}));

const ModernCard = styled(Card)(({ theme }) => ({
  background: alpha('#ffffff', 0.95),
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: `1px solid ${alpha('#ffffff', 0.2)}`,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
  }
}));

const GradientButton = styled(AppButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0e339b, #4876a3ff)',
  borderRadius: '25px',
  padding: '12px 30px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '16px',
  color: 'white',
  border: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #0e339b, #185a9d)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  },
  '&:disabled': {
    background: '#ccc',
    color: '#999',
    transform: 'none',
  }
}));

const InventoryView: React.FC = () => {
  const [chocolates, setChocolates] = useState<Chocolate[]>([]);
  const [userCash, setUserCash] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'error' | 'success' }>({ open: false, message: '' });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventory();
      setChocolates(data.chocolates);
      setUserCash(data.userCash);
    } catch (error) {
      setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleRestock = async (name: string) => {
    try {
      await restockChocolate(name);
      setSnackbar({ open: true, message: `${name} restocked!`, severity: 'success' });
      fetchInventory();
    } catch (error) {
      setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' as const };
    if (quantity <= 3) return { label: 'Low Stock', color: 'warning' as const };
    return { label: 'In Stock', color: 'success' as const };
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Inventory sx={{ fontSize: 40, color: 'white' }} />
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Inventory Management
          </Typography>
        </Box>
        
        <CashCard elevation={3}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
            <AttachMoney sx={{ fontSize: 35 }} />
            <Typography variant="h3" fontWeight="bold">
              {userCash.toFixed(2)}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            User Cash
          </Typography>
        </CashCard>

        <Grid container spacing={3}>
          {chocolates.map((choc, index) => {
            const stockStatus = getStockStatus(choc.quantity);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={choc.name}>
                <Grow 
                  in 
                  timeout={600 + index * 100}
                  style={{ height : '100%'}}
                >
                  <div >
                    <ModernCard>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Typography 
                          variant="h5" 
                          fontWeight="bold" 
                          color="primary"
                          sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                        >
                          🍫 {choc.name}
                        </Typography>
                        <Chip 
                          label={stockStatus.label} 
                          color={stockStatus.color}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        mb={2}
                        p={2}
                        sx={{
                          backgroundColor: alpha('#667eea', 0.1),
                          borderRadius: '12px',
                          border: `1px solid ${alpha('#667eea', 0.2)}`,
                        }}
                      >
                        <Typography variant="body1" color="text.secondary" fontWeight="medium">
                          Price:
                        </Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          ${choc.price}
                        </Typography>
                      </Box>
                      
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        p={2}
                        sx={{
                          backgroundColor: alpha('#43cea2', 0.1),
                          borderRadius: '12px',
                          border: `1px solid ${alpha('#43cea2', 0.2)}`,
                        }}
                      >
                        <Typography variant="body1" color="text.secondary" fontWeight="medium">
                          Quantity:
                        </Typography>
                        <Typography 
                          variant="h5" 
                          fontWeight="bold"
                          color={choc.quantity <= 3 ? 'error.main' : 'success.main'}
                        >
                          {choc.quantity}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <GradientButton
                        fullWidth
                        onClick={() => handleRestock(choc.name)}
                        disabled={choc.quantity === 10 || loading}
                        startIcon={<Refresh />}
                        size="large"
                      >
                        {choc.quantity === 10 ? 'Fully Stocked' : 'Restock'}
                      </GradientButton>
                    </CardActions>
                  </ModernCard>
                  </div>
                </Grow>
              </Grid>
            );
          })}
        </Grid>

        <AppSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </Fade>
  );
};

export default InventoryView;