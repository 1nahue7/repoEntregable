import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import { EntidadesTable } from './crud/EntidadesTable';
import { ContactosTable } from './crud/ContactosTable';
import { ActivosTable } from './crud/ActivosTable';
import { ContratosTable } from './crud/ContratosTable';
import { FacturasTable } from './crud/FacturasTable';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fafafa' }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: 'white',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 600 }}>
              Sistema de Alquiler de Activos
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} sx={{ color: 'text.primary' }}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/entidades" element={<EntidadesTable />} />
            <Route path="/contactos" element={<ContactosTable />} />
            <Route path="/activos" element={<ActivosTable />} />
            <Route path="/contratos" element={<ContratosTable />} />
            <Route path="/facturas" element={<FacturasTable />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
