import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GenericWizardDialog } from './GenericWizardDialog';
import { GenericEditModal } from './GenericEditModal';

export const GenericCRUDTable = ({
  title,
  data,
  columns,
  loading,
  error,
  onCreate,
  onUpdate,
  onDelete,
  createSteps = [],
  updateFields,
  modalTitleCreate,
  modalTitleUpdate,
  wizardInitialValues = {},
  getFieldOptions = () => ({}),
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const numericFieldNames = useMemo(() => {
    const names = new Set();
    createSteps.forEach((step) => {
      step?.fields?.forEach((field) => {
        if (field?.type === 'number' && field?.name) {
          names.add(field.name);
        }
      });
    });
    return names;
  }, [createSteps]);

  const numericUpdateFieldNames = useMemo(() => {
    const names = new Set();
    updateFields?.forEach((field) => {
      if (field?.type === 'number' && field?.name) {
        names.add(field.name);
      }
    });
    return names;
  }, [updateFields]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({});
    setCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
  };

  const prepareEditValues = (item) => {
    if (!updateFields || updateFields.length === 0) return { ...item };

    return updateFields.reduce((acc, field) => {
      if (field.getInitialValue) {
        acc[field.name] = field.getInitialValue(item);
      } else if (item[field.name] !== undefined) {
        acc[field.name] = item[field.name];
      } else if (
        field.name.endsWith('Id') &&
        item[field.name] === undefined &&
        item[field.name.replace(/Id$/, '')]?.id
      ) {
        acc[field.name] = item[field.name.replace(/Id$/, '')]?.id;
      }
      return acc;
    }, { ...item });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData(prepareEditValues(item));
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleCreateSubmit = async (values) => {
    try {
      const payload = Object.entries(values).reduce((acc, [key, rawValue]) => {
        if (rawValue === undefined || rawValue === null) {
          return acc;
        }

        if (typeof rawValue === 'string') {
          const trimmed = rawValue.trim();
          if (trimmed === '') {
            return acc;
          }

          if (numericFieldNames.has(key)) {
            const numericValue = Number(trimmed);
            if (Number.isFinite(numericValue)) {
              acc[key] = numericValue;
            }
            return acc;
          }

          acc[key] = trimmed;
          return acc;
        }

        if (numericFieldNames.has(key) && typeof rawValue === 'number') {
          acc[key] = rawValue;
          return acc;
        }

        acc[key] = rawValue;
        return acc;
      }, {});

      if (editingItem && editingItem.id) {
        console.warn('Ignoring create submission while editing an item', editingItem);
        return;
      }

      await onCreate(payload);
      handleCloseCreate();
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      let cleanFormData = { ...formData };

      delete cleanFormData.__typename;
      delete cleanFormData.id;
      delete cleanFormData._id;

      cleanFormData = Object.keys(cleanFormData).reduce((acc, key) => {
        const value = cleanFormData[key];
        if (value && typeof value === 'object' && value.__typename) {
          if (key === 'entidad') acc.entidadId = value.id;
          else if (key === 'activo') acc.activoId = value.id;
          else if (key === 'contrato') acc.contratoId = value.id;
        } else {
          if (numericUpdateFieldNames.has(key) && typeof value === 'string') {
            const numericValue = Number(value.trim());
            if (Number.isFinite(numericValue)) {
              acc[key] = numericValue;
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});

      if (editingItem) {
        await onUpdate(editingItem.id, cleanFormData);
      }
      handleCloseEdit();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
      try {
        await onDelete(id);
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar los datos: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Crear Nuevo
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field}>{col.headerName}</TableCell>
                ))}
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id} hover>
                    {columns.map((col) => (
                      <TableCell key={col.field}>
                        {col.render
                          ? col.render(item[col.field], item)
                          : item[col.field]}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(item)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <GenericWizardDialog
        open={createOpen}
        onClose={handleCloseCreate}
        title={modalTitleCreate}
        steps={createSteps}
        initialValues={wizardInitialValues}
        onSubmit={handleCreateSubmit}
      />

      <GenericEditModal
        open={editOpen}
        onClose={handleCloseEdit}
        title={modalTitleUpdate}
        fields={updateFields}
        formData={formData}
        handleChange={handleChange}
        onSubmit={handleEditSubmit}
        getFieldOptions={getFieldOptions}
      />
    </Box>
  );
};
