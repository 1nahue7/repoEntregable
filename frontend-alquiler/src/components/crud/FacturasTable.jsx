import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { useMutation } from '@apollo/client/react';
import { useApolloClient } from '@apollo/client/react';
import { GenericCRUDTable } from './GenericCRUDTable';
import {
  GET_FACTURAS,
  GET_ENTIDADES,
  GET_CONTRATOS,
  CREATE_FACTURA,
  UPDATE_FACTURA,
  DELETE_FACTURA,
} from '../../lib/graphql-queries';
import { useDashboard } from '../../context/DashboardContext';

export const FacturasTable = () => {
  const client = useApolloClient();
  const { refreshDashboard } = useDashboard();

  const { loading, error, data } = useQuery(GET_FACTURAS);
  const { data: entidadesData } = useQuery(GET_ENTIDADES);
  const { data: contratosData } = useQuery(GET_CONTRATOS);

  const [createFactura] = useMutation(CREATE_FACTURA, {
    refetchQueries: [{ query: GET_FACTURAS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [updateFactura] = useMutation(UPDATE_FACTURA, {
    refetchQueries: [{ query: GET_FACTURAS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [deleteFactura] = useMutation(DELETE_FACTURA, {
    refetchQueries: [{ query: GET_FACTURAS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const handleCreate = async (formData) => {
    await createFactura({
      variables: {
        input: formData,
      },
    });
  };

  const handleUpdate = async (id, formData) => {
    await updateFactura({
      variables: {
        id,
        input: formData,
      },
    });
  };

  const handleDelete = async (id) => {
    await deleteFactura({
      variables: { id },
    });
  };

  const columns = [
    { field: 'numero', headerName: 'Número' },
    { field: 'contratoId', headerName: 'Contrato ID' },
    { field: 'entidadId', headerName: 'Entidad ID' },
    {
      field: 'fechaFactura',
      headerName: 'Fecha Factura',
    },
    {
      field: 'subtotal',
      headerName: 'Subtotal',
      render: (value) => `$${value?.toFixed(2)}`,
    },
    {
      field: 'iva',
      headerName: 'IVA',
      render: (value) => `$${value?.toFixed(2)}`,
    },
    {
      field: 'total',
      headerName: 'Total',
      render: (value) => `$${value?.toFixed(2)}`,
    },
    { field: 'estado', headerName: 'Estado' },
  ];

  const wizardInitialValues = useMemo(() => {
    const facturasList = data?.facturas || [];
    const now = new Date();
    const yearPrefix = `FAC-${now.getFullYear()}`;
    const suffixes = facturasList
      .map((factura) => factura.numero)
      .filter((numero) => typeof numero === 'string')
      .map((numero) => {
        const exactMatch = numero.match(/^FAC-\d{4}-(\d+)$/);
        if (exactMatch && numero.startsWith(yearPrefix)) {
          return Number(exactMatch[1]);
        }
        const fallbackMatch = numero.match(/(\d+)$/);
        return fallbackMatch ? Number(fallbackMatch[1]) : null;
      })
      .filter((value) => Number.isFinite(value));
    const nextSequence =
      suffixes.length > 0 ? Math.max(...suffixes) + 1 : facturasList.length + 1;
    const sequenceStr = String(nextSequence).padStart(3, '0');
    let candidate = `${yearPrefix}-${sequenceStr}`;
    if (facturasList.some((factura) => factura.numero === candidate)) {
      candidate = `${yearPrefix}-${String(Date.now()).slice(-3)}`;
    }
    const dateISO = now.toISOString().split('T')[0];

    return {
      numero: candidate,
      fechaFactura: dateISO,
      estado: 'pendiente',
      subtotal: 0,
      iva: 0,
      total: 0,
    };
  }, [data?.facturas]);

  const createSteps = [
    {
      id: 'general',
      label: 'General',
      title: 'Datos generales',
      description: 'Completa los datos básicos de la factura.',
      fields: [
        {
          name: 'numero',
          label: 'Número',
          type: 'text',
          required: true,
          readOnly: true,
          helperText: 'Se genera automáticamente',
          grid: 6,
        },
        { name: 'fechaFactura', label: 'Fecha de emisión', type: 'date', required: true, grid: 6 },
        {
          name: 'estado',
          label: 'Estado',
          type: 'select',
          required: true,
          defaultValue: wizardInitialValues.estado,
          grid: 6,
          options: [
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'pagada', label: 'Pagada' },
            { value: 'vencida', label: 'Vencida' },
          ],
        },
      ],
    },
    {
      id: 'asociaciones',
      label: 'Asociaciones',
      title: 'Vinculación',
      description: 'Relaciona la factura con la entidad y el contrato correspondiente.',
      loadData: async () => {
        const [contratosResult, entidadesResult] = await Promise.all([
          client.query({ query: GET_CONTRATOS, fetchPolicy: 'network-only' }),
          client.query({ query: GET_ENTIDADES, fetchPolicy: 'network-only' }),
        ]);

        const contratos = contratosResult?.data?.contratos || [];
        const entidades = entidadesResult?.data?.entidades || [];

        const contratoEntidadMap = contratos.reduce((acc, contrato) => {
          if (contrato?.id) {
            acc[contrato.id] = {
              entidadId: contrato.entidad?.id || '',
            };
          }
          return acc;
        }, {});

        return {
          contratoId:
            contratos.map((contrato) => ({
              value: contrato.id,
              label: `${contrato.numero} · ${contrato.entidad?.nombre || 'Sin entidad'}`,
            })) || [],
          entidadId:
            entidades.map((entidad) => ({
              value: entidad.id,
              label: `${entidad.nombre} (${entidad.tipo})`,
            })) || [],
          contratoEntidadMap,
        };
      },
      onFieldChange: (name, value, { setFormValues, stepData, setFieldErrors }) => {
        if (name === 'contratoId') {
          const lookup = stepData?.asociaciones?.contratoEntidadMap || {};
          const match = lookup[value];
          const entidadId = match?.entidadId || '';
          setFormValues((prev) => ({
            ...prev,
            entidadId,
          }));
          if (setFieldErrors && entidadId) {
            setFieldErrors((prev) => ({ ...prev, entidadId: undefined }));
          }
        }
      },
      fields: [
        {
          name: 'contratoId',
          label: 'Contrato',
          type: 'select',
          required: true,
          helperText: 'Selecciona un contrato disponible',
          fullWidth: true,
        },
        {
          name: 'entidadId',
          label: 'Entidad',
          type: 'select',
          required: true,
          helperText: 'Se completa automáticamente según el contrato',
          disabled: true,
          fullWidth: true,
        },
      ],
    },
    {
      id: 'totales',
      label: 'Totales',
      title: 'Resumen de valores',
      description: 'Ingresa los valores económicos de la factura.',
      onFieldChange: (name, value, { setFormValues }) => {
        if (name === 'subtotal' || name === 'iva') {
          setFormValues((prev) => {
            const subtotal = name === 'subtotal' ? Number(value || 0) : Number(prev.subtotal || 0);
            const iva = name === 'iva' ? Number(value || 0) : Number(prev.iva || 0);
            const total = subtotal + iva;
            return {
              ...prev,
              total: Number.isFinite(total) ? Number(total.toFixed(2)) : prev.total,
            };
          });
        }
      },
      fields: [
        { name: 'subtotal', label: 'Subtotal', type: 'number', required: true, grid: 4 },
        { name: 'iva', label: 'IVA', type: 'number', required: true, grid: 4 },
        {
          name: 'total',
          label: 'Total',
          type: 'number',
          required: true,
          readOnly: true,
          helperText: 'Se calcula automáticamente',
          grid: 4,
        },
      ],
    },
  ];

  const updateFields = [
    { name: 'numero', label: 'Número', type: 'text', required: true },
    {
      name: 'contratoId',
      label: 'Contrato',
      type: 'select',
      options:
        contratosData?.contratos?.map((contrato) => ({
          value: contrato.id,
          label: `${contrato.numero} · ${contrato.entidad?.nombre || 'Sin entidad'}`,
        })) || [],
      getInitialValue: (item) => item.contrato?.id || item.contratoId,
      required: true,
    },
    {
      name: 'entidadId',
      label: 'Entidad',
      type: 'select',
      options:
        entidadesData?.entidades?.map((entidad) => ({
          value: entidad.id,
          label: `${entidad.nombre} (${entidad.tipo})`,
        })) || [],
      getInitialValue: (item) => item.entidad?.id || item.entidadId,
      required: true,
      readOnly: true,
    },
    { name: 'fechaFactura', label: 'Fecha de emisión', type: 'date' },
    { name: 'subtotal', label: 'Subtotal', type: 'number', required: true },
    { name: 'iva', label: 'IVA', type: 'number', required: true },
    {
      name: 'total',
      label: 'Total',
      type: 'number',
      required: true,
      readOnly: true,
      helperText: 'Se recalcula automáticamente',
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagada', label: 'Pagada' },
        { value: 'vencida', label: 'Vencida' },
      ],
      getInitialValue: (item) => item.estado?.toLowerCase?.() || item.estado,
    },
  ];

  return (
    <GenericCRUDTable
      title="Facturas"
      data={data?.facturas || []}
      columns={columns}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      createSteps={createSteps}
      updateFields={updateFields}
      modalTitleCreate="Crear Nueva Factura"
      modalTitleUpdate="Editar Factura"
      wizardInitialValues={wizardInitialValues}
    />
  );
};
