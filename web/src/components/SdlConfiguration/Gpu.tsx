import React, { useCallback, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { MeasurementControl } from '../MeasurementControl';
import { AddNewButton, AddNewButtonWrapper, FieldWrapper, PlusSign, SdlSectionWrapper } from './styling';
import { Button, Box, Stack, Typography, List, ListItem, OutlinedInput } from '@mui/material';
import { IconTrash } from '../Icons';

type GpuUnitProps = {
  currentProfile: string;
  disabled: boolean;
};

type GpuProps = {
  currentProfile: string;
  disabled: boolean;
};

const GpuUnits: React.FC<GpuUnitProps> = ({ currentProfile, disabled }) => {
  const { setFieldValue, values } = useFormikContext<any>();

  const handleSetUnits = useCallback((name: string, units: string) => {
    const unitsAsInt = parseInt(units);
    setFieldValue(`sdl.profiles.compute.${currentProfile}.resources.gpu.units`, unitsAsInt);
  }, [currentProfile, setFieldValue]);

  return (
    <FieldWrapper>
      <Field
        name={`sdl.profiles.compute.${currentProfile}.resources.gpu.units`}
        defaultValue={formValues.sdl.profiles.compute[currentProfile].resources.gpu.units || 0}
        id="gpu"
      >
        {({ field, form, meta }: any) => (
          <React.Fragment>
            <MeasurementControl
              error={meta?.error}
              title="GPU"
              subTitle="GPUs Required"
              setFieldValue={handleSetUnits}
              type="number"
              withOutSuffix
              disabled={disabled}
              {...field}
            >
            </MeasurementControl>
          </React.Fragment>
        )}
      </Field>
    </FieldWrapper>
  );
};

// tag based component for selecting which gpus to allow.
const GpuAttributes: React.FC<GpuUnitProps> = ({ currentProfile, disabled }) => {
  const { setFieldValue, values } = useFormikContext();
  const formValues = (values as any);

  const [attributes, setAttributes] = useState<string[]>(() => {
    const attributes = formValues.sdl.profiles.compute[currentProfile].resources.gpu.attributes;
    if (attributes) {
      return attributes.map((attr: any) => attr.key);
    }
    return [];
  });

  const handleSetAttributes = useCallback((attributes: string[]) => {
    const attrObjs = attributes
      .filter((attr) => attr !== '')
      .map((key) => ({ key, value: true }));

    setFieldValue(`sdl.profiles.compute.${currentProfile}.resources.gpu.attributes`, attrObjs);
  }, [currentProfile, setFieldValue]);

  const addAttribute = useCallback(() => {
    setAttributes((attributes) => [...attributes, '']);
  }, []);

  const removeAttribute = useCallback((index: number) => {
    setAttributes((attributes) => attributes.filter((_, i) => i !== index));
  }, []);

  return (
    <FieldWrapper>
      <Typography variant="body2" color="text.secondary" marginTop={2}>
        Example filters:
        <List>
          <ListItem>/vendor/nvidia/model/a6000 (nVidia A6000 only)</ListItem>
          <ListItem>/vendor/amd/model/* (any AMD GPU)</ListItem>
        </List>
      </Typography>
      <Stack gap={1}>
        {attributes.map((attribute, index) => (
          <Stack direction="row" key={index} gap={1}>
            <Box
              flexGrow={1}
            >
              <OutlinedInput
                type="text"
                placeholder="Enter GPU Filter"
                value={attribute}
                fullWidth={true}
                inputProps={{
                  style: {
                    padding: '10px 16px',
                  }
                }}
                onChange={(e) => {
                  const newAttributes = [...attributes];
                  newAttributes[index] = e.target.value;
                  setAttributes(newAttributes);
                  handleSetAttributes(newAttributes);
                }}
              />
            </Box>
            <Button onClick={() => removeAttribute(index)}
              aria-label='delete'
              variant="outlined">
              <IconTrash />
            </Button>
          </Stack>
        ))}

        {!disabled && (
          <AddNewButtonWrapper>
            <AddNewButton
              startIcon={<PlusSign />}
              variant="outlined"
              size="small"
              onClick={addAttribute}
            >
              Add New GPU Filter
            </AddNewButton>
          </AddNewButtonWrapper>
        )}
      </Stack>
    </FieldWrapper >
  );
};

export const Gpu: React.FC<GpuProps> = ({ currentProfile, disabled }) => {
  const { values } = useFormikContext<any>();

  return (
    <SdlSectionWrapper>
      <Typography variant="h4">
        GPUs
      </Typography>
      <Stack>
        <GpuUnits currentProfile={currentProfile} disabled={disabled} />
        {values.sdl.profiles.compute[currentProfile].resources.gpu.units > 0 && (
          <GpuAttributes currentProfile={currentProfile} disabled={disabled} />
        )}
      </Stack>
    </SdlSectionWrapper>
  );
};