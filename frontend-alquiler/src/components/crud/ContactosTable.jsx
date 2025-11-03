import { useQuery } from '@apollo/client/react';
import { useMutation } from '@apollo/client/react';
import { useApolloClient } from '@apollo/client/react';
import { GenericCRUDTable } from './GenericCRUDTable';
import {
  GET_CONTACTOS,
  GET_ENTIDADES,
  CREATE_CONTACTO,
  UPDATE_CONTACTO,
  DELETE_CONTACTO,
} from '../../lib/graphql-queries';
import { useDashboard } from '../../context/DashboardContext';

export const ContactosTable = () => {
  const client = useApolloClient();
  const { refreshDashboard } = useDashboard();

  const { loading, error, data } = useQuery(GET_CONTACTOS);
  const { data: entidadesData } = useQuery(GET_ENTIDADES);

  const [createContacto] = useMutation(CREATE_CONTACTO, {
    refetchQueries: [{ query: GET_CONTACTOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [updateContacto] = useMutation(UPDATE_CONTACTO, {
    refetchQueries: [{ query: GET_CONTACTOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [deleteContacto] = useMutation(DELETE_CONTACTO, {
    refetchQueries: [{ query: GET_CONTACTOS }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const handleCreate = async (formData) => {
    await createContacto({
      variables: {
        input: formData,
      },
    });
  };

  const handleUpdate = async (id, formData) => {
    await updateContacto({
      variables: {
        id,
        input: formData,
      },
    });
  };

  const handleDelete = async (id) => {
    await deleteContacto({
      variables: { id },
    });
  };

  const columns = [
    { field: 'nombre', headerName: 'Nombre' },
    {
      field: 'entidad',
      headerName: 'Entidad',
      render: (entidad) => entidad?.nombre || 'N/A'
    },
    { field: 'email', headerName: 'Email' },
    { field: 'telefono', headerName: 'Teléfono' },
    { field: 'cargo', headerName: 'Cargo' },
  ];

  const createSteps = [
    {
      id: 'entidad',
      label: 'Entidad',
      title: 'Selecciona la entidad',
      description: 'Indica a qué entidad pertenece este contacto.',
      loadData: async () => {
        const { data: entidadesResult } = await client.query({
          query: GET_ENTIDADES,
          fetchPolicy: 'network-only',
        });

        return {
          entidadId:
            entidadesResult?.entidades?.map((entidad) => ({
              value: entidad.id,
              label: `${entidad.nombre} (${entidad.tipo})`,
            })) || [],
        };
      },
      fields: [
        {
          name: 'entidadId',
          label: 'Entidad',
          type: 'select',
          required: true,
          placeholder: 'Busca por nombre o tipo',
          fullWidth: true,
        },
      ],
    },
    {
      id: 'perfil',
      label: 'Perfil',
      title: 'Información del contacto',
      description: 'Comparte quién es y qué rol ocupa dentro de la organización.',
      fields: [
        { name: 'nombre', label: 'Nombre completo', type: 'text', required: true, placeholder: 'Ana María López', fullWidth: true },
        { name: 'cargo', label: 'Cargo', type: 'text', required: true, placeholder: 'Gerente de Compras', fullWidth: true },
      ],
    },
    {
      id: 'comunicacion',
      label: 'Comunicación',
      title: 'Canales de contacto',
      description: 'Añade los datos para mantenerte en contacto.',
      fields: [
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'ana@empresa.com', fullWidth: true },
        { name: 'telefono', label: 'Teléfono', type: 'text', required: true, placeholder: '+57 321 654 9870', fullWidth: true },
      ],
    },
  ];

  const updateFields = [
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
    },
    { name: 'nombre', label: 'Nombre completo', type: 'text', required: true },
    { name: 'cargo', label: 'Cargo', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'text', required: true },
  ];

  return (
    <GenericCRUDTable
      title="Contactos"
      data={data?.contactos || []}
      columns={columns}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      createSteps={createSteps}
      updateFields={updateFields}
      modalTitleCreate="Crear Nuevo Contacto"
      modalTitleUpdate="Editar Contacto"
    />
  );
};
