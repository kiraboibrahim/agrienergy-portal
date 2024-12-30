import { Box, Button, Stepper, Step, StepIndicator } from "@mui/joy";
import { Formik, Form } from "formik";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const FormWizardContext = createContext();
function useFormWizardContext() {
  const formWizardContext = useContext(FormWizardContext);
  return formWizardContext;
}

function getFormWizardHash(steps) {
  return Object.keys(steps).reduce((hash, stepIndex) => {
    return `${hash}${stepIndex}${steps[stepIndex].length}`;
  }, "form-wizard-");
}

export default function FormWizard({ steps, onSubmit, children }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const formWizardHash = getFormWizardHash(steps);
  const [_values, _setValues] = useLocalStorage(formWizardHash, {});

  const isCompletedStep = (stepIndex) => {
    return parseInt(stepIndex) < currentStepIndex;
  };
  const isCurrentStep = (stepIndex) => {
    return parseInt(stepIndex) === currentStepIndex;
  };
  const isFirstStep = () => {
    return currentStepIndex === 1;
  };

  const isFinalStep = () => {
    const finalStepIndex = Math.max(
      ...Object.keys(steps).map((stepIndex) => parseInt(stepIndex))
    );
    return currentStepIndex === finalStepIndex;
  };
  const previousStep = () => {
    if (isFirstStep()) return;
    setCurrentStepIndex(currentStepIndex - 1);
  };
  const nextStep = () => {
    if (isFinalStep()) return;
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const submit = (values) => {
    setValues(values);
    if (!isFinalStep()) {
      nextStep();
    } else {
      setIsSubmitting(true);
      Promise.resolve(onSubmit(values)).finally(() => setIsSubmitting(false));
    }
  };

  const setValues = (values) => {
    _setValues({ ..._values, ...values });
  };

  return (
    <FormWizardContext.Provider
      value={{
        meta: {
          isSubmitting,
          currentStepIndex,
          values: _values,
        },
        helpers: {
          isFirstStep,
          isCurrentStep,
          isFinalStep,
          previousStep,
          setValues,
          submit,
        },
      }}
    >
      <Stepper sx={{ marginBottom: 3 }} size="sm">
        {Object.keys(steps).map((stepIndex) => {
          return (
            <Step
              key={stepIndex}
              indicator={
                <StepIndicator
                  variant="solid"
                  color={
                    isCompletedStep(stepIndex)
                      ? "success"
                      : isCurrentStep(stepIndex)
                      ? "neutral"
                      : "secondary"
                  }
                >
                  {stepIndex}
                </StepIndicator>
              }
              orientation="vertical"
              sx={[
                stepIndex < currentStepIndex && {
                  "&::after": { bgcolor: "success.solidBg" },
                },
              ]}
            >
              {steps[stepIndex]}
            </Step>
          );
        })}
      </Stepper>
      {children}
    </FormWizardContext.Provider>
  );
}

export function FormWizardStep({
  stepIndex,
  validationSchema,
  children,
  isOptional = false,
}) {
  const { meta, helpers } = useFormWizardContext();
  if (helpers.isCurrentStep(stepIndex)) {
    return (
      <Formik
        initialValues={meta.values}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          helpers.submit(values);
        }}
      >
        <Form>
          {children}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 3,
            }}
          >
            <Button
              sx={{ marginRight: 1 }}
              disabled={helpers.isFirstStep() || meta.isSubmitting}
              size="sm"
              variant="soft"
              onClick={() => helpers.previousStep()}
            >
              Back
            </Button>
            <Button
              type="submit"
              size="sm"
              color="success"
              disabled={meta.isSubmitting}
              loading={meta.isSubmitting}
              loadingPosition="start"
            >
              {isOptional
                ? helpers.isFinalStep()
                  ? "Skip & Finish"
                  : "Skip"
                : helpers.isFinalStep()
                ? "Finish"
                : "Next"}
            </Button>
          </Box>
        </Form>
      </Formik>
    );
  }
}
