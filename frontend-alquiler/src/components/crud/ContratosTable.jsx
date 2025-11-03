import { useQuery } from '@apollo/client/react';
import { useMutation } from '@apollo/client/react';
import { useApolloClient } from '@apollo/client/react';
import { GenericCRUDTable } from './GenericCRUDTable';
import {
  GET_CONTRATOS,
  GET_ENTIDADES,
  GET_ACTIVOS,
  CREATE_CONTRATO,
  UPDATE_CONTRATO,
  DELETE_CONTRATO,
} from '../../lib/graphql-queries';
import { useDashboard } from '../../context/DashboardContext';

export const ContratosTable = () => {
  const client = useApolloClient();
  const { refreshDashboard } = useDashboard();

  const { loading, error, data } = useQuery(GET_CONTRATOS);
  const { data: entidadesData } = useQuery(GET_ENTIDADES);
  const { data: activosData } = useQuery(GET_ACTIVOS);

  const [createContrato] = useMutation(CREATE_CONTRATO, {
    refetchQueries: [{ query: GET_CONTRATOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [updateContrato] = useMutation(UPDATE_CONTRATO, {
    refetchQueries: [{ query: GET_CONTRATOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [deleteContrato] = useMutation(DELETE_CONTRATO, {
    refetchQueries: [{ query: GET_CONTRATOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const handleCreate = async (formData) => {
    await createContrato({
      variables: {
        input: formData,
      },
    });
  };

  const handleUpdate = async (id, formData) => {
    await updateContrato({
      variables: {
        id,
        input: formData,
      },
    });
  };

  const handleDelete = async (id) => {
    await deleteContrato({
      variables: { id },
    });
  };

  const columns = [
    { field: 'numero', headerName: 'Número' },
    {
      field: 'entidad',
      headerName: 'Entidad',
      render: (entidad) => entidad?.nombre || 'N/A'
    },
    {
      field: 'activo',
      headerName: 'Activo',
      render: (activo) => activo ? `${activo.codigo} - ${activo.nombre}` : 'N/A'
    },
    { field: 'fechaInicio', headerName: 'Fecha Inicio' },
    { field: 'fechaFin', headerName: 'Fecha Fin' },
    {
      field: 'precioTotal',
      headerName: 'Precio Total',
      render: (value) => `$${value?.toFixed(2)}`,
    },
    { field: 'estado', headerName: 'Estado' },
  ];

  const createSteps = [
    {
      id: 'informacion',
      label: 'Información general',
      title: 'Datos del contrato',
      description: 'Completa los datos básicos para iniciar un nuevo contrato.',
      fields: [
        { name: 'numero', label: 'Número de contrato', type: 'text', required: true, placeholder: 'CT-2024-001', grid: 6 },
        {
          name: 'estado',
          label: 'Estado',
          type: 'select',
          required: true,
          defaultValue: 'activo',
          placeholder: 'Selecciona un estado',
          grid: 6,
          options: [
            { value: 'activo', label: 'Activo' },
            { value: 'finalizado', label: 'Finalizado' },
            { value: 'cancelado', label: 'Cancelado' },
          ],
        },
        { name: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true, grid: 6 },
        { name: 'fechaFin', label: 'Fecha de finalización', type: 'date', required: true, grid: 6 },
        {
          name: 'precioTotal',
          label: 'Precio total',
          type: 'number',
          required: true,
          placeholder: '0.00',
          fullWidth: true,
        },
      ],
    },
    {
      id: 'entidad',
      label: 'Cliente',
      title: 'Selecciona la entidad',
      description: 'Elige la entidad o cliente responsable del contrato.',
      loadData: async () => {
        const { data: entidadesResult } = await client.query({
          query: GET_ENTIDADES,
          fetchPolicy: 'network-only',
        });

        return {
          entidadId:
            entidadesResult?.entidades?.map((entidad) => ({
              value: entidad.id,
              label: `${entidad.nombre} · ${entidad.tipo}`,
            })) || [],
        };
      },
      fields: [
        {
          name: 'entidadId',
          label: 'Entidad',
          type: 'select',
          required: true,
          placeholder: 'Selecciona una entidad',
          fullWidth: true,
        },
      ],
    },
    {
      id: 'activo',
      label: 'Activo',
      title: 'Asignar activo',
      description: 'Vincula uno de los activos disponibles para este contrato.',
      loadData: async () => {
        const { data: activosResult } = await client.query({
          query: GET_ACTIVOS,
          fetchPolicy: 'network-only',
        });

        return {
          activoId:
            activosResult?.activos
              ?.filter((activo) => activo.estado?.toLowerCase() !== 'alquilado')
              .map((activo) => ({
                value: activo.id,
                label: `${activo.codigo} · ${activo.nombre} (${activo.tipo})`,
              })) || [],
        };
      },
      fields: [
        {
          name: 'activoId',
          label: 'Activo a alquilar',
          type: 'select',
          required: true,
          placeholder: 'Selecciona un activo disponible',
          fullWidth: true,
        },
      ],
    },
    {
      id: 'detalle',
      label: 'Detalle',
      title: 'Notas adicionales',
      description: 'Agrega información relevante que ayude a comprender el contrato.',
      fields: [
        {
          name: 'observaciones',
          label: 'Observaciones',
          type: 'multiline',
          rows: 4,
          placeholder: 'Instrucciones de entrega, condiciones especiales, etc.',
          fullWidth: true,
        },
      ],
    },
  ];

  const updateFields = [
    { name: 'numero', label: 'Número de contrato', type: 'text', required: true },
    {
      name: 'entidadId',
      label: 'Entidad',
      type: 'select',
      options:
        entidadesData?.entidades?.map((entidad) => ({
          value: entidad.id,
          label: `${entidad.nombre} · ${entidad.tipo}`,
        })) || [],
      getInitialValue: (item) => item.entidad?.id || item.entidadId,
      required: true,
    },
    {
      name: 'activoId',
      label: 'Activo',
      type: 'select',
      options:
        activosData?.activos?.map((activo) => ({
          value: activo.id,
          label: `${activo.codigo} · ${activo.nombre} (${activo.tipo})`,
        })) || [],
      getInitialValue: (item) => item.activo?.id || item.activoId,
      required: true,
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'activo', label: 'Activo' },
        { value: 'finalizado', label: 'Finalizado' },
        { value: 'cancelado', label: 'Cancelado' },
        { value: 'vencido', label: 'Vencido' },
      ],
      getInitialValue: (item) => item.estado?.toLowerCase?.() || item.estado,
    },
    {
      name: 'observaciones',
      label: 'Observaciones',
      type: 'text',
      multiline: true,
      rows: 3,
      fullWidth: true,
    },
  ];

  return (
    <GenericCRUDTable
      title="Contratos"
      data={data?.contratos || []}
      columns={columns}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      createSteps={createSteps}
      updateFields={updateFields}
      modalTitleCreate="Crear Nuevo Contrato"
      modalTitleUpdate="Editar Contrato"
    />
  );
};
