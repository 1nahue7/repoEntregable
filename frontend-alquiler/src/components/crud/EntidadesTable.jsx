import { useQuery } from '@apollo/client/react';
import { useMutation } from '@apollo/client/react';
import { useApolloClient } from '@apollo/client/react';
import { GenericCRUDTable } from './GenericCRUDTable';
import {
  GET_ENTIDADES,
  CREATE_ENTIDAD,
  UPDATE_ENTIDAD,
  DELETE_ENTIDAD,
} from '../../lib/graphql-queries';
import { useDashboard } from '../../context/DashboardContext';

export const EntidadesTable = () => {
  const client = useApolloClient();
  const { refreshDashboard } = useDashboard();

  const { loading, error, data } = useQuery(GET_ENTIDADES);

  const [createEntidad] = useMutation(CREATE_ENTIDAD, {
    refetchQueries: [{ query: GET_ENTIDADES }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [updateEntidad] = useMutation(UPDATE_ENTIDAD, {
    refetchQueries: [{ query: GET_ENTIDADES }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const [deleteEntidad] = useMutation(DELETE_ENTIDAD, {
    refetchQueries: [{ query: GET_ENTIDADES }],
    onCompleted: () => {
      client.cache.reset();
      refreshDashboard();
    },
  });

  const handleCreate = async (formData) => {
    await createEntidad({
      variables: {
        input: formData,
      },
    });
  };

  const handleUpdate = async (id, formData) => {
    await updateEntidad({
      variables: {
        id,
        input: formData,
      },
    });
  };

  const handleDelete = async (id) => {
    await deleteEntidad({
      variables: { id },
    });
  };

  const columns = [
    { field: 'nombre', headerName: 'Nombre' },
    { field: 'tipo', headerName: 'Tipo' },
    { field: 'numeroDocumento', headerName: 'N° Documento' },
    { field: 'email', headerName: 'Email' },
    { field: 'telefono', headerName: 'Teléfono' },
    { field: 'ciudad', headerName: 'Ciudad' },
  ];

  const createSteps = [
    {
      id: 'identidad',
      label: 'Identidad',
      title: 'Información de la entidad',
      description: 'Cuéntanos quién es el cliente o proveedor que estás registrando.',
      fields: [
        { name: 'nombre', label: 'Nombre legal', type: 'text', required: true, placeholder: 'Ej: Constructora Andina', fullWidth: true },
        {
          name: 'tipo',
          label: 'Tipo de entidad',
          type: 'select',
          required: true,
          placeholder: 'Selecciona un tipo',
          options: [
            { value: 'empresa', label: 'Empresa' },
            { value: 'persona', label: 'Persona Física' },
          ],
        },
        {
          name: 'documento',
          label: 'Tipo de documento',
          type: 'select',
          required: true,
          placeholder: 'Selecciona un documento',
          options: [],
        },
        {
          name: 'numeroDocumento',
          label: 'Número de documento',
          type: 'text',
          required: true,
          placeholder: '123456789-0',
          fullWidth: true,
        },
      ],
      onFieldChange: (name, value, { formValues, setFormValues }) => {
        if (name === 'tipo') {
          let documentoOptions = [];
          if (value === 'empresa') {
            documentoOptions = [{ value: 'CUIT', label: 'CUIT' }];
          } else if (value === 'persona') {
            documentoOptions = [
              { value: 'CUIL', label: 'CUIL' },
              { value: 'DNI', label: 'DNI' },
            ];
          }
          setFormValues((prev) => ({
            ...prev,
            documento: documentoOptions.length > 0 ? documentoOptions[0].value : '',
          }));
        }
      },
    },
    {
      id: 'contacto',
      label: 'Contacto',
      title: 'Datos de contacto',
      description: 'Agrega los canales de contacto para comunicarte fácilmente.',
      fields: [
        { name: 'email', label: 'Email principal', type: 'email', required: true, placeholder: 'contacto@empresa.com', fullWidth: true },
        { name: 'telefono', label: 'Teléfono', type: 'text', required: true, placeholder: '+57 123 456 7890', fullWidth: true },
      ],
    },
    {
      id: 'ubicacion',
      label: 'Ubicación',
      title: 'Dirección y ciudad',
      description: 'Completa la información de ubicación para visitas o envíos.',
      fields: [
        { name: 'direccion', label: 'Dirección', type: 'text', required: true, placeholder: 'Calle 123 #45-67', fullWidth: true },
        { name: 'ciudad', label: 'Ciudad', type: 'text', required: true, placeholder: 'Bogotá D.C.', fullWidth: true },
      ],
    },
  ];

  const updateFields = [
    { name: 'nombre', label: 'Nombre legal', type: 'text', required: true, fullWidth: true },
    {
      name: 'tipo',
      label: 'Tipo de entidad',
      type: 'select',
      options: [
        { value: 'empresa', label: 'Empresa' },
        { value: 'persona', label: 'Persona Física' },
      ],
      required: true,
    },
    {
      name: 'documento',
      label: 'Tipo de documento',
      type: 'select',
      options: [],
      required: true,
    },
    { name: 'numeroDocumento', label: 'Número de documento', type: 'text', required: true },
    { name: 'email', label: 'Email principal', type: 'email' },
    { name: 'telefono', label: 'Teléfono', type: 'text', required: true },
    { name: 'direccion', label: 'Dirección', type: 'text', required: true },
    { name: 'ciudad', label: 'Ciudad', type: 'text', required: true },
  ];

  const getDocumentoOptions = (tipo) => {
    if (tipo === 'empresa') {
      return [{ value: 'CUIT', label: 'CUIT' }];
    } else if (tipo === 'persona') {
      return [
        { value: 'CUIL', label: 'CUIL' },
        { value: 'DNI', label: 'DNI' },
      ];
    }
    return [];
  };

  return (
    <GenericCRUDTable
      title="Entidades"
      data={data?.entidades || []}
      columns={columns}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      createSteps={createSteps}
      updateFields={updateFields}
      modalTitleCreate="Crear Nueva Entidad"
      modalTitleUpdate="Editar Entidad"
      getFieldOptions={(fieldName, currentFormData) => {
        if (fieldName === 'documento') {
          return getDocumentoOptions(currentFormData.tipo);
        }
        return [];
      }}
    />
  );
};
