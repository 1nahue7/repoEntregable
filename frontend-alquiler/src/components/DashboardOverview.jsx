import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Label,
} from 'recharts';
import {
  GET_ENTIDADES,
  GET_CONTACTOS,
  GET_ACTIVOS,
  GET_CONTRATOS,
  GET_FACTURAS,
  GET_ACTIVOS_ESTADOS,
  GET_CONTRATOS_ESTADOS,
  GET_FACTURAS_ESTADOS,
} from '../lib/graphql-queries';
import { useDashboard } from '../context/DashboardContext';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#00796b'];

const StatCard = ({ title, value, icon, color = '#1976d2', trend = null }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}25`,
        },
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: color, mb: trend ? 1 : 0 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight={600}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: 2,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({ title, children, action = null }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {action}
        </Box>
        <Box sx={{ flexGrow: 1, minHeight: 280, height: 320 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardOverview = () => {
  const { refreshKey } = useDashboard();

  const { data: entidadesData, loading: loadingEntidades, refetch: refetchEntidades } = useQuery(GET_ENTIDADES);
  const { data: contactosData, loading: loadingContactos, refetch: refetchContactos } = useQuery(GET_CONTACTOS);
  const { data: activosData, loading: loadingActivos, refetch: refetchActivos } = useQuery(GET_ACTIVOS);
  const { data: contratosData, loading: loadingContratos, refetch: refetchContratos } = useQuery(GET_CONTRATOS);
  const { data: facturasData, loading: loadingFacturas, refetch: refetchFacturas } = useQuery(GET_FACTURAS);

  const { data: activosEstadosData, loading: loadingActivosEstados, refetch: refetchActivosEstados } = useQuery(GET_ACTIVOS_ESTADOS);
  const { data: contratosEstadosData, loading: loadingContratosEstados, refetch: refetchContratosEstados } = useQuery(GET_CONTRATOS_ESTADOS);
  const { data: facturasEstadosData, loading: loadingFacturasEstados, refetch: refetchFacturasEstados } = useQuery(GET_FACTURAS_ESTADOS);

  useEffect(() => {
    if (refreshKey > 0) {
      refetchActivosEstados();
      refetchContratosEstados();
      refetchFacturasEstados();
      refetchActivos();
      refetchContratos();
      refetchFacturas();
      refetchEntidades();
      refetchContactos();
    }
  }, [refreshKey]);

  const loading = loadingEntidades || loadingContactos || loadingActivos || loadingContratos || loadingFacturas || loadingActivosEstados || loadingContratosEstados || loadingFacturasEstados;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const entidades = entidadesData?.entidades || [];
  const contactos = contactosData?.contactos || [];
  const activos = activosData?.activos || [];
  const contratos = contratosData?.contratos || [];
  const facturas = facturasData?.facturas || [];

  const activosEstados = activosEstadosData?.activos || activos;
  const contratosEstados = contratosEstadosData?.contratos || contratos;
  const facturasEstados = facturasEstadosData?.facturas || facturas;

  const totalEntidades = entidades.length;
  const totalContactos = contactos.length;
  const totalActivos = activos.length;
  const totalContratos = contratos.length;
  const totalFacturas = facturas.length;

  const ingresosTotales = facturas.reduce((sum, f) => sum + (parseFloat(f.total) || 0), 0);

  const activosDisponibles = activosEstados.filter(a => a?.estado?.toLowerCase() === 'disponible').length;
  const activosAlquilados = activosEstados.filter(a => a?.estado?.toLowerCase() === 'alquilado').length;
  const activosMantenimiento = activosEstados.filter(a => a?.estado?.toLowerCase() === 'mantenimiento').length;
  const activosEnReparacion = activosEstados.filter(a => a?.estado?.toLowerCase() === 'reparacion').length;

  const contratosActivos = contratosEstados.filter(c => c?.estado?.toLowerCase() === 'activo').length;
  const contratosVencidos = contratosEstados.filter(c => c?.estado?.toLowerCase() === 'vencido').length;
  const contratosFinalizados = contratosEstados.filter(c => c?.estado?.toLowerCase() === 'finalizado').length;

  const facturasPagadas = facturasEstados.filter(f => f?.estado?.toLowerCase() === 'pagada').length;
  const facturasPendientes = facturasEstados.filter(f => f?.estado?.toLowerCase() === 'pendiente').length;
  const facturasVencidas = facturasEstados.filter(f => f?.estado?.toLowerCase() === 'vencida').length;

  const activosPorTipo = activos.reduce((acc, activo) => {
    acc[activo.tipo] = (acc[activo.tipo] || 0) + 1;
    return acc;
  }, {});

  const activosPorTipoData = Object.entries(activosPorTipo).map(([name, value]) => ({
    name,
    value,
  }));

  const activosPorEstadoData = [
    { name: 'Disponibles', value: activosDisponibles, color: '#2e7d32' },
    { name: 'Alquilados', value: activosAlquilados, color: '#1976d2' },
    { name: 'Mantenimiento', value: activosMantenimiento, color: '#ed6c02' },
    { name: 'Reparación', value: activosEnReparacion, color: '#d32f2f' },
  ].filter(item => item.value > 0);

  const contratosPorEstadoData = [
    { name: 'Activos', value: contratosActivos, color: '#2e7d32' },
    { name: 'Vencidos', value: contratosVencidos, color: '#d32f2f' },
    { name: 'Finalizados', value: contratosFinalizados, color: '#757575' },
  ].filter(item => item.value > 0);

  const facturasPorEstadoData = [
    { name: 'Pagadas', value: facturasPagadas, color: '#2e7d32' },
    { name: 'Pendientes', value: facturasPendientes, color: '#ed6c02' },
    { name: 'Vencidas', value: facturasVencidas, color: '#d32f2f' },
  ].filter(item => item.value > 0);

  const totalActivosEstado = activosPorEstadoData.reduce((acc, item) => acc + item.value, 0);
  const totalContratosEstado = contratosPorEstadoData.reduce((acc, item) => acc + item.value, 0);
  const totalFacturasEstado = facturasPorEstadoData.reduce((acc, item) => acc + item.value, 0);

  const renderCenterLabel = (value, subtitle) => ({ viewBox }) => {
    if (!viewBox || typeof viewBox.cx !== 'number' || typeof viewBox.cy !== 'number') {
      return null;
    }

    const { cx, cy } = viewBox;

    return (
      <g>
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="#0f172a"
          fontSize="22"
          fontWeight="700"
        >
          {value}
        </text>
        {subtitle ? (
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.08em"
            style={{ textTransform: 'uppercase' }}
          >
            {subtitle}
          </text>
        ) : null}
      </g>
    );
  };

  const tooltipContentStyle = {
    borderRadius: 12,
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0px 18px 40px rgba(15, 23, 42, 0.12)',
    backgroundColor: '#ffffff',
    padding: '12px 16px',
  };

  const tooltipLabelStyle = { fontWeight: 600, color: '#1f2937' };

  const donutFormatter = (total) => (value, name, entry) => {
    const percent = total ? Math.round((entry?.payload?.value / total) * 100) : 0;
    return [`${value} (${percent}%)`, name];
  };

  const contratosRecientes = [...contratos]
    .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
    .slice(0, 5);

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return 'success';
      case 'VENCIDO':
        return 'error';
      case 'FINALIZADO':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard General
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Total Entidades"
            value={totalEntidades}
            icon={<BusinessIcon sx={{ fontSize: 28, color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Total Contactos"
            value={totalContactos}
            icon={<PeopleIcon sx={{ fontSize: 28, color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Total Activos"
            value={totalActivos}
            icon={<InventoryIcon sx={{ fontSize: 28, color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Total Contratos"
            value={totalContratos}
            icon={<ReceiptIcon sx={{ fontSize: 28, color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Ingresos Totales"
            value={`$${ingresosTotales.toLocaleString()}`}
            icon={<MoneyIcon sx={{ fontSize: 28, color: '#d32f2f' }} />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Activos por Estado">
            {activosPorEstadoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 8, bottom: 28 }}>
                  <Pie
                    data={activosPorEstadoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={4}
                    cornerRadius={10}
                    stroke="#f8fafc"
                    strokeWidth={3}
                    dataKey="value"
                  >
                    {activosPorEstadoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label content={renderCenterLabel(totalActivosEstado, 'Total')} />
                  </Pie>
                  <RechartsTooltip
                    formatter={donutFormatter(totalActivosEstado)}
                    contentStyle={tooltipContentStyle}
                    labelStyle={tooltipLabelStyle}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 12 }}
                    formatter={(value) => (
                      <span style={{ color: '#475569', fontWeight: 500 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  No hay datos de activos
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {activosPorEstadoData.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption">{item.name}</Typography>
                  </Box>
                  <Typography variant="caption" fontWeight={600}>
                    {item.value} ({((item.value / totalActivos) * 100).toFixed(0)}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Contratos por Estado">
            {contratosPorEstadoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 8, bottom: 28 }}>
                  <Pie
                    data={contratosPorEstadoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={4}
                    cornerRadius={10}
                    stroke="#f8fafc"
                    strokeWidth={3}
                    dataKey="value"
                  >
                    {contratosPorEstadoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label content={renderCenterLabel(totalContratosEstado, 'Total')} />
                  </Pie>
                  <RechartsTooltip
                    formatter={donutFormatter(totalContratosEstado)}
                    contentStyle={tooltipContentStyle}
                    labelStyle={tooltipLabelStyle}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 12 }}
                    formatter={(value) => (
                      <span style={{ color: '#475569', fontWeight: 500 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  No hay datos de contratos
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {contratosPorEstadoData.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption">{item.name}</Typography>
                  </Box>
                  <Typography variant="caption" fontWeight={600}>
                    {item.value} ({totalContratos > 0 ? ((item.value / totalContratos) * 100).toFixed(0) : 0}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Facturas por Estado">
            {facturasPorEstadoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 8, bottom: 28 }}>
                  <Pie
                    data={facturasPorEstadoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={4}
                    cornerRadius={10}
                    stroke="#f8fafc"
                    strokeWidth={3}
                    dataKey="value"
                  >
                    {facturasPorEstadoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label content={renderCenterLabel(totalFacturasEstado, 'Total')} />
                  </Pie>
                  <RechartsTooltip
                    formatter={donutFormatter(totalFacturasEstado)}
                    contentStyle={tooltipContentStyle}
                    labelStyle={tooltipLabelStyle}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={10}
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 12 }}
                    formatter={(value) => (
                      <span style={{ color: '#475569', fontWeight: 500 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  No hay datos de facturas
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {facturasPorEstadoData.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption">{item.name}</Typography>
                  </Box>
                  <Typography variant="caption" fontWeight={600}>
                    {item.value} ({totalFacturas > 0 ? ((item.value / totalFacturas) * 100).toFixed(0) : 0}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Grid>
      </Grid>

      {activosPorTipoData.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <ChartCard title="Distribución de Activos por Tipo">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activosPorTipoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ChartCard title="Contratos Recientes">
            {contratosRecientes.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Número</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Entidad</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Activo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Fecha Inicio</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Precio Total</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contratosRecientes.map((contrato) => (
                      <TableRow key={contrato.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{contrato.numero}</TableCell>
                        <TableCell>{contrato.entidad?.nombre || 'N/A'}</TableCell>
                        <TableCell>{contrato.activo?.nombre || 'N/A'}</TableCell>
                        <TableCell>{new Date(contrato.fechaInicio).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>${contrato.precioTotal.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={contrato.estado}
                            size="small"
                            color={getStatusColor(contrato.estado)}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No hay contratos recientes
                </Typography>
              </Box>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
