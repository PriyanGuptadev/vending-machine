import  { useEffect, useState } from 'react';
import { getInventory, buyChocolate } from '../../api/vendingApi';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import AppSnackbar from '../../components/AppSnackbar';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  Box, 
  Typography, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Chip,
  Fade,
  
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, AttachMoney } from '@mui/icons-material';
import type { Chocolate } from '../../api/vendingApi';

// Styled components
const CashCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0e339b, #185a9d)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: '20px',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const ModernCard = styled(Card)(({ theme }) => ({
  background: alpha('#ffffff', 0.95),
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: `1px solid ${alpha('#ffffff', 0.2)}`,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
  }
}));

const SelectionCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
  padding: theme.spacing(2),
  borderRadius: '15px',
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha('#667eea', 0.2)}`,
}));

const GradientButton = styled(AppButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0e339b, #4876a3ff)',
  borderRadius: '25px',
  padding: '16px 32px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '18px',
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

const BuyView: React.FC = () => {
  const [chocolates, setChocolates] = useState<Chocolate[]>([]);
  const [userCash, setUserCash] = useState<number>(0);
  const [selected, setSelected] = useState<string>('');
  const [cashInserted, setCashInserted] = useState<string>('');
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

  const handleBuy = async () => {
    if (!selected || !cashInserted) {
      setSnackbar({ open: true, message: 'Please select a chocolate and enter cash.', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      const result = await buyChocolate(selected, Number(cashInserted));
      setSnackbar({ open: true, message: `Enjoy your ${result.chocolate}! Change: $${result.change}`, severity: 'success' });
      setCashInserted('');
      fetchInventory();
    } catch (error) {
      setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedChocolate = chocolates.find(c => c.name === selected);

  return (
    <Fade in timeout={800}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <ShoppingCart sx={{ fontSize: 40, color: 'white' }} />
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Buy Chocolate
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
            Available Cash
          </Typography>
        </CashCard>

        <ModernCard>
          <CardContent sx={{ p: 4 }}>
            <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
              <InputLabel 
                id="chocolate-select-label" 
                sx={{ 
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                Choose Your Chocolate
              </InputLabel>
              <Select
                labelId="chocolate-select-label"
                value={selected}
                label="Choose Your Chocolate"
                onChange={(e) => setSelected(e.target.value)}
                sx={{ 
                  borderRadius: '15px',
                  fontSize: '16px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                  }
                }}
              >
                {chocolates.map((choc) => (
                  <MenuItem 
                    value={choc.name} 
                    key={choc.name} 
                    disabled={choc.quantity === 0}
                    sx={{ 
                      py: 2,
                      '&:hover': {
                        backgroundColor: alpha('#667eea', 0.1),
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                      <Typography variant="body1" fontWeight="medium">
                        {choc.name}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip 
                          label={`$${choc.price}`} 
                          color="primary" 
                          size="small" 
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                        {choc.quantity === 0 && (
                          <Chip 
                            label="Out of Stock" 
                            color="error" 
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedChocolate && (
              <Fade in timeout={400}>
                <SelectionCard elevation={0}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                    🍫 Selected: {selectedChocolate.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Price: <strong>${selectedChocolate.price}</strong>
                  </Typography>
                </SelectionCard>
              </Fade>
            )}

            <AppInput
              label="Cash Inserted"
              type="number"
              value={cashInserted}
              onChange={(e) => setCashInserted(e.target.value)}
              inputProps={{ min: 0 }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '15px',
                  fontSize: '18px',
                }
              }}
            />

            <GradientButton
              onClick={handleBuy}
              disabled={loading || !selected || !cashInserted}
              fullWidth
              size="large"
            >
              {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={24} color="inherit" />
                  <span>Processing...</span>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" gap={1}>
                  <ShoppingCart />
                  <span>Purchase Chocolate</span>
                </Box>
              )}
            </GradientButton>
          </CardContent>
        </ModernCard>

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

export default BuyView;