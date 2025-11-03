import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
} from '@mui/material';


export const GenericEditModal = ({
  open,
  onClose,
  title,
  fields,
  formData,
  handleChange,
  onSubmit,
  getFieldOptions = () => ({}),
}) => {
  const renderField = (field) => {
    const value =
      formData[field.name] === undefined || formData[field.name] === null
        ? field.defaultValue ?? ''
        : formData[field.name];

    if (field.type === 'select') {
      const dynamicOptions = getFieldOptions(field.name, formData);
      const options = dynamicOptions.length > 0 ? dynamicOptions : (field.options || []);

      const handleFieldChange = (e) => {
        const newValue = e.target.value;
        handleChange(field.name, newValue);

        if (field.onChange) {
          field.onChange(newValue, {
            formData,
            handleChange,
            setFormData: (updateFn) => {
              if (typeof updateFn === 'function') {
                const updated = updateFn({ ...formData });
                Object.keys(updated).forEach(key => {
                  handleChange(key, updated[key]);
                });
              }
            },
          });
        }
      };

      return (
        <TextField
          select
          fullWidth
          label={field.label}
          value={value}
          onChange={handleFieldChange}
          placeholder={field.placeholder}
          InputLabelProps={field.InputLabelProps}
          SelectProps={{
            displayEmpty: Boolean(field.placeholder),
            renderValue: (selected) => {
              if (
                (selected === '' || selected === undefined || selected === null) &&
                field.placeholder
              ) {
                return (
                  <span style={{ color: 'rgba(148, 163, 184, 0.9)' }}>{field.placeholder}</span>
                );
              }
              const option = options.find((opt) => opt.value === selected);
              return option?.label || selected;
            },
          }}
        >
          {field.placeholder ? (
            <MenuItem value="" disabled>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {field.placeholder}
              </Typography>
            </MenuItem>
          ) : null}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        fullWidth
        label={field.label}
        type={field.type || 'text'}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        multiline={field.multiline || false}
        rows={field.rows || 1}
        InputProps={{
          readOnly: field.readOnly || false,
        }}
        InputLabelProps={
          field.type === 'date' || field.type === 'datetime-local'
            ? { shrink: true }
            : field.InputLabelProps
        }
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 28px 60px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(148, 163, 184, 0.18)',
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          px: 3,
          py: 3,
          backgroundColor: 'rgba(248, 250, 252, 0.9)',
        }}
      >
        <Grid container spacing={2.5}>
          {fields.map((field) => (
            <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          backgroundColor: '#fff',
          borderTop: '1px solid rgba(148, 163, 184, 0.16)',
        }}
      >
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            borderRadius: 2,
          }}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
