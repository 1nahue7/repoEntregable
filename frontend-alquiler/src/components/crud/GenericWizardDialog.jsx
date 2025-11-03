import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';


export const GenericWizardDialog = ({
  open,
  onClose,
  title,
  steps = [],
  initialValues = {},
  onSubmit,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState(initialValues);
  const [stepData, setStepData] = useState({});
  const [stepLoading, setStepLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const currentStep = useMemo(() => steps[activeStep] || null, [steps, activeStep]);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setFormValues(initialValues);
      setStepData({});
      setFieldErrors({});
    }
  }, [open, initialValues]);

  useEffect(() => {
    if (!open || !currentStep) return;

    let shouldApplyDefaults = false;
    const defaultsToApply = {};

    currentStep.fields?.forEach((field) => {
      if (field.defaultValue === undefined) return;
      const currentValue = formValues[field.name];
      const isEmpty =
        currentValue === undefined ||
        currentValue === null ||
        (typeof currentValue === 'string' && currentValue.trim() === '');
      if (isEmpty) {
        defaultsToApply[field.name] = field.defaultValue;
        shouldApplyDefaults = true;
      }
    });

    if (shouldApplyDefaults) {
      setFormValues((prev) => ({ ...defaultsToApply, ...prev }));
    }
  }, [open, currentStep, formValues]);

  useEffect(() => {
    const fetchStepData = async () => {
      if (!open || !currentStep?.loadData || stepData[currentStep.id]) {
        return;
      }
      setStepLoading(true);
      try {
        const data = await currentStep.loadData();
        setStepData((prev) => ({ ...prev, [currentStep.id]: data || {} }));
      } catch (err) {
        console.error(`Error loading data for step ${currentStep.id}:`, err);
      } finally {
        setStepLoading(false);
      }
    };

    fetchStepData();
  }, [open, currentStep, stepData]);

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (currentStep?.onFieldChange) {
      currentStep.onFieldChange(name, value, {
        formValues,
        setFormValues,
        stepData,
        setStepData,
        setFieldErrors,
      });
    }
  };

  const validateStep = () => {
    if (!currentStep) return true;
    const newErrors = {};

    currentStep.fields?.forEach((field) => {
      const value = formValues[field.name];
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '');

      if (field.required && isEmpty) {
        newErrors[field.name] = field.errorMessage || 'Este campo es obligatorio.';
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (activeStep === steps.length - 1) {
      try {
        await onSubmit(formValues);
        setActiveStep(0);
        onClose();
      } catch (err) {
        console.error('Error submitting wizard form:', err);
      }
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) return;
    setActiveStep((prev) => prev - 1);
  };

  const optionsForField = (field) => {
    const fromStepData = currentStep?.id ? stepData[currentStep.id]?.[field.name] : undefined;
    return fromStepData || field.options || [];
  };

  const renderField = (field) => {
    const options = optionsForField(field);
    const value =
      formValues[field.name] === undefined || formValues[field.name] === null
        ? field.defaultValue ?? ''
        : formValues[field.name];

    if (field.type === 'select') {
      const shouldShrink =
        field.defaultValue !== undefined ||
        value !== '' ||
        field.required ||
        field.readOnly ||
        field.disabled;

      return (
        <TextField
          select
          fullWidth
          label={field.label}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          error={Boolean(fieldErrors[field.name])}
          helperText={fieldErrors[field.name] || field.helperText}
          sx={{
            ...field.sx,
            '& .MuiInputLabel-root': {
              ...(field.required && { color: 'primary.main' }),
            },
          }}
          disabled={field.disabled}
          InputLabelProps={{
            shrink: shouldShrink,
            ...(field.InputLabelProps || {}),
          }}
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
            MenuProps: {
              PaperProps: {
                sx: {
                  borderRadius: 2,
                  boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.18)',
                  mt: 1,
                },
              },
            },
          }}
        >
          {field.placeholder ? (
            <MenuItem disabled value="">
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

    if (field.type === 'multiline') {
      return (
        <TextField
          fullWidth
          multiline
          minRows={field.rows || 3}
          label={field.label}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          error={Boolean(fieldErrors[field.name])}
          helperText={fieldErrors[field.name] || field.helperText}
          sx={field.sx}
          disabled={field.disabled}
          InputProps={{
            readOnly: field.readOnly,
            ...(field.InputProps || {}),
          }}
          InputLabelProps={{
            ...(field.InputLabelProps || {}),
          }}
        />
      );
    }

    const baseLabelProps =
      field.type === 'date' || field.type === 'datetime-local' ? { shrink: true } : {};

    return (
      <TextField
        fullWidth
        label={field.label}
        type={field.type || 'text'}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        error={Boolean(fieldErrors[field.name])}
        helperText={fieldErrors[field.name] || field.helperText}
        InputLabelProps={{
          ...baseLabelProps,
          ...(field.InputLabelProps || {}),
        }}
        sx={field.sx}
        disabled={field.disabled}
        InputProps={{
          readOnly: field.readOnly || false,
          ...(field.InputProps || {}),
        }}
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
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0px 32px 65px rgba(15, 23, 42, 0.18)',
        },
      }}
    >
      <DialogTitle sx={{ px: 3.5, pt: 3.5, pb: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          px: 3.5,
          pb: 0,
          backgroundColor: 'rgba(248, 250, 252, 0.85)',
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ pb: 3 }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            backgroundColor: '#fff',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            minHeight: 220,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {currentStep?.title || currentStep?.label}
          </Typography>
          {currentStep?.description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {currentStep.description}
            </Typography>
          ) : null}
          {stepLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {currentStep?.fields?.map((field) => (
                <Grid
                  item
                  key={field.name}
                  xs={12}
                  sm={field.fullWidth ? 12 : field.grid || 6}
                >
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3.5,
          py: 3,
          backgroundColor: '#fff',
          borderTop: '1px solid rgba(148, 163, 184, 0.12)',
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Cancelar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          color="inherit"
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Volver
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            borderRadius: 2.5,
          }}
        >
          {activeStep === steps.length - 1 ? 'Confirmar' : 'Continuar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
