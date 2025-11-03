import { useQuery } from '@apollo/client/react';
import { useMutation } from '@apollo/client/react';
import { useApolloClient } from '@apollo/client/react';
import { GenericCRUDTable } from './GenericCRUDTable';
import {
  GET_ACTIVOS,
  CREATE_ACTIVO,
  UPDATE_ACTIVO,
  DELETE_ACTIVO,
} from '../../lib/graphql-queries';
import { useDashboard } from '../../context/DashboardContext';

export const ActivosTable = () => {
  const client = useApolloClient();
  const { refreshDashboard } = useDashboard();

  const { loading, error, data } = useQuery(GET_ACTIVOS);

  const [createActivo] = useMutation(CREATE_ACTIVO, {
    refetchQueries: [{ query: GET_ACTIVOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [updateActivo] = useMutation(UPDATE_ACTIVO, {
    refetchQueries: [{ query: GET_ACTIVOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [deleteActivo] = useMutation(DELETE_ACTIVO, {
    refetchQueries: [{ query: GET_ACTIVOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const handleCreate = async (formData) => {
    await createActivo({
      variables: {
        input: formData,
      },
    });
  };

  const handleUpdate = async (id, formData) => {
    await updateActivo({
      variables: {
        id,
        input: formData,
      },
    });
  };

  const handleDelete = async (id) => {
    await deleteActivo({
      variables: { id },
    });
  };

  const columns = [
    { field: 'codigo', headerName: 'Código' },
    { field: 'tipo', headerName: 'Tipo' },
    { field: 'nombre', headerName: 'Nombre' },
    { field: 'marca', headerName: 'Marca' },
    { field: 'modelo', headerName: 'Modelo' },
    { field: 'anio', headerName: 'Año' },
    {
      field: 'valorAlquiler',
      headerName: 'Valor Alquiler',
      render: (value) => `$${value?.toFixed(2)}`,
    },
    { field: 'estado', headerName: 'Estado' },
  ];

  const createSteps = [
    {
      id: 'identificacion',
      label: 'Identificación',
      title: 'Información principal',
      description: 'Define la identidad del activo que sumarás a tu inventario.',
      fields: [
        { name: 'codigo', label: 'Código', type: 'text', required: true, placeholder: 'EQ-001', grid: 6 },
        {
          name: 'tipo',
          label: 'Tipo',
          type: 'select',
          required: true,
          placeholder: 'Selecciona un tipo',
          grid: 6,
          options: [
            { value: 'vehiculo', label: 'Vehículo' },
            { value: 'equipo', label: 'Equipo' },
            { value: 'maquinaria', label: 'Maquinaria' },
          ],
        },
        { name: 'nombre', label: 'Nombre comercial', type: 'text', required: true, fullWidth: true },
        {
          name: 'descripcion',
          label: 'Descripción',
          type: 'multiline',
          placeholder: 'Características relevantes y observaciones del activo.',
          required: true,
          fullWidth: true,
          rows: 4,
        },
      ],
    },
    {
      id: 'caracteristicas',
      label: 'Características',
      title: 'Detalles técnicos',
      description: 'Completa los detalles técnicos que necesitas para operar el activo.',
      fields: [
        { name: 'marca', label: 'Marca', type: 'text', required: true, grid: 6 },
        { name: 'modelo', label: 'Modelo', type: 'text', required: true, grid: 6 },
        { name: 'anio', label: 'Año', type: 'number', required: true, placeholder: '2024', grid: 6 },
        {
          name: 'valorAlquiler',
          label: 'Valor de alquiler diario',
          type: 'number',
          required: true,
          placeholder: '0.00',
          grid: 6,
        },
      ],
    },
    {
      id: 'disponibilidad',
      label: 'Disponibilidad',
      title: 'Estado operativo',
      description: 'Indica la disponibilidad actual del activo dentro del catálogo.',
      fields: [
        {
          name: 'estado',
          label: 'Estado',
          type: 'select',
          required: true,
          placeholder: 'Selecciona un estado',
          defaultValue: 'disponible',
          options: [
            { value: 'disponible', label: 'Disponible' },
            { value: 'alquilado', label: 'Alquilado' },
            { value: 'mantenimiento', label: 'Mantenimiento' },
            { value: 'baja', label: 'Fuera de servicio' },
          ],
        },
      ],
    },
  ];

  const updateFields = [
    { name: 'codigo', label: 'Código', type: 'text', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'vehiculo', label: 'Vehículo' },
        { value: 'equipo', label: 'Equipo' },
        { value: 'maquinaria', label: 'Maquinaria' },
      ],
      required: true,
    },
    { name: 'nombre', label: 'Nombre comercial', type: 'text', required: true },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'text',
      multiline: true,
      rows: 3,
      fullWidth: true,
      required: true,
    },
    { name: 'marca', label: 'Marca', type: 'text', required: true },
    { name: 'modelo', label: 'Modelo', type: 'text', required: true },
    { name: 'anio', label: 'Año', type: 'number', required: true },
    { name: 'valorAlquiler', label: 'Valor de alquiler diario', type: 'number', required: true },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'disponible', label: 'Disponible' },
        { value: 'alquilado', label: 'Alquilado' },
        { value: 'mantenimiento', label: 'Mantenimiento' },
        { value: 'baja', label: 'Fuera de servicio' },
      ],
    },
  ];

  return (
    <GenericCRUDTable
      title="Activos"
      data={data?.activos || []}
      columns={columns}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      createSteps={createSteps}
      updateFields={updateFields}
      modalTitleCreate="Crear Nuevo Activo"
      modalTitleUpdate="Editar Activo"
    />
  );
};
