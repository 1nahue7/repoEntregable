import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import {
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const GET_ENTIDADES_COUNT = gql`
  query GetEntidadesCount {
    entidades {
      id
    }
  }
`;

const GET_ACTIVOS_DATA = gql`
  query GetActivosData {
    activos {
      id
      estado
    }
  }
`;

const GET_CONTRATOS_DATA = gql`
  query GetContratosData {
    contratos {
      id
      estado
      precioTotal
    }
  }
`;

const GET_FACTURAS_DATA = gql`
  query GetFacturasData {
    facturas {
      id
      estado
      total
    }
  }
`;

const DashboardStats = () => {
  const { loading: loadingEntidades, data: entidadesData } = useQuery(
    GET_ENTIDADES_COUNT,
    { fetchPolicy: 'cache-first' }
  );
  const { loading: loadingActivos, data: activosData } = useQuery(
    GET_ACTIVOS_DATA,
    { fetchPolicy: 'cache-first' }
  );
  const { loading: loadingContratos, data: contratosData } = useQuery(
    GET_CONTRATOS_DATA,
    { fetchPolicy: 'cache-first' }
  );
  const { loading: loadingFacturas, data: facturasData } = useQuery(
    GET_FACTURAS_DATA,
    { fetchPolicy: 'cache-first' }
  );

  if (loadingEntidades || loadingActivos || loadingContratos || loadingFacturas) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalEntidades = entidadesData?.entidades?.length || 0;
  const totalActivos = activosData?.activos?.length || 0;
  const totalContratos = contratosData?.contratos?.length || 0;
  const totalFacturas = facturasData?.facturas?.length || 0;

  const activosPorEstado = activosData?.activos?.reduce((acc, activo) => {
    acc[activo.estado] = (acc[activo.estado] || 0) + 1;
    return acc;
  }, {}) || {};

  const activosChartData = Object.entries(activosPorEstado).map(([name, value]) => ({
    name,
    value,
  }));

  const contratosPorEstado = contratosData?.contratos?.reduce((acc, contrato) => {
    acc[contrato.estado] = (acc[contrato.estado] || 0) + 1;
    return acc;
  }, {}) || {};

  const contratosChartData = Object.entries(contratosPorEstado).map(([name, value]) => ({
    name,
    value,
  }));

  const ingresosMensuales = [
    { mes: 'Ene', ingresos: 45000 },
    { mes: 'Feb', ingresos: 52000 },
    { mes: 'Mar', ingresos: 48000 },
    { mes: 'Abr', ingresos: 61000 },
    { mes: 'May', ingresos: 55000 },
    { mes: 'Jun', ingresos: 67000 },
  ];

  const topClientes = [
    { nombre: 'Empresa ABC', contratos: 12 },
    { nombre: 'Corporación XYZ', contratos: 9 },
    { nombre: 'Organización 123', contratos: 7 },
    { nombre: 'Grupo DEF', contratos: 5 },
    { nombre: 'Sociedad GHI', contratos: 4 },
  ];

  const COLORS = ['#1976d2', '#dc004e', '#ed6c02', '#2e7d32', '#9c27b0', '#00acc1'];

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Dashboard General
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Entidades"
            value={totalEntidades}
            icon={<BusinessIcon sx={{ fontSize: 40, color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Activos"
            value={totalActivos}
            icon={<InventoryIcon sx={{ fontSize: 40, color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Contratos Activos"
            value={totalContratos}
            icon={<DescriptionIcon sx={{ fontSize: 40, color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Facturas"
            value={totalFacturas}
            icon={<ReceiptIcon sx={{ fontSize: 40, color: '#dc004e' }} />}
            color="#dc004e"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 3,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              backgroundImage: 'linear-gradient(160deg, rgba(248, 250, 252, 0.7) 0%, #ffffff 100%)',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Activos por Estado
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, bottom: 32 }}>
                <Pie
                  data={activosChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  cornerRadius={10}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#f8fafc"
                  strokeWidth={4}
                  dataKey="value"
                >
                  {activosChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label content={renderCenterLabel(totalActivos, 'Total')} />
                </Pie>
                <Tooltip
                  formatter={(value, name, entry) => {
                    const percent = totalActivos
                      ? Math.round((entry?.payload?.value / totalActivos) * 100)
                      : 0;
                    return [`${value} (${percent}%)`, name];
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.12)',
                    backgroundColor: '#ffffff',
                  }}
                  labelStyle={{ fontWeight: 600, color: '#1f2937' }}
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
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contratos por Estado
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={contratosChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Ingresos Mensuales
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={ingresosMensuales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Top Clientes
            </Typography>
            <Box sx={{ mt: 2 }}>
              {topClientes.map((cliente, index) => (
                <Box
                  key={cliente.nombre}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    p: 1.5,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: COLORS[index % COLORS.length],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 2,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {cliente.nombre}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {cliente.contratos} contratos
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;
