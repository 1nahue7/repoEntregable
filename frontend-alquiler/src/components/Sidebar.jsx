import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Toolbar,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Entidades', icon: <BusinessIcon />, path: '/dashboard/entidades' },
  { label: 'Contactos', icon: <PeopleIcon />, path: '/dashboard/contactos' },
  { label: 'Activos', icon: <InventoryIcon />, path: '/dashboard/activos' },
  { label: 'Contratos', icon: <DescriptionIcon />, path: '/dashboard/contratos' },
  { label: 'Facturas', icon: <ReceiptIcon />, path: '/dashboard/facturas' },
];

const Sidebar = ({ drawerWidth = 260 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          px: 2.5,
          py: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
          AlquilerApp
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Sistema Administrativo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '100%' }}>
          <Avatar sx={{ bgcolor: 'white', color: '#1976d2', width: 36, height: 36, fontSize: 16, fontWeight: 700 }}>
            A
          </Avatar>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, lineHeight: 1.2 }}>
              Administrador
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              admin@alquiler.com
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.25),
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      color: 'primary.main',
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 44,
                    color: isActive ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
