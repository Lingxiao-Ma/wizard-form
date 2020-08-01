import React, { useState } from "react";
import { Modal } from "antd";
import { Form } from "formik-antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { WizardFormSteps, IStepPageConfig } from "./WizardFormSteps";

const FormSchema = Yup.object().shape({
  feedbackCategory: Yup.string().required("Please select a category"),
});

export interface IWizardFormSampleProps {
  stepConfigs: WizardFormSteps;
  initialStepConfig: IStepPageConfig;
  onSubmit: (values: object) => void;
  onCancel: () => void;
}
export const WizardFormSample = (props: IWizardFormSampleProps) => {
  const { stepConfigs, initialStepConfig, onSubmit, onCancel } = props;

  const [stepConfig, setStepConfig] = useState<IStepPageConfig>(
    initialStepConfig
  );
  const gotoNext = (
    name: string,
    setFieldTouched: (
      field: string,
      isTouched?: boolean,
      shouldValidate?: boolean
    ) => void
  ) => () => {
    try {
      setStepConfig(stepConfigs.nextStepConfig() as IStepPageConfig);
    } catch {
      // Enable error message
      setFieldTouched(name, true);
    }
  };

  const handleOK = (
    submitForm: () => Promise<any>,
    name: string,
    setFieldTouched: (
      field: string,
      isTouched?: boolean,
      shouldValidate?: boolean
    ) => void
  ) => {
    return stepConfigs.hasNext() ? gotoNext(name, setFieldTouched) : submitForm;
  };
  const okText = stepConfigs.hasNext() ? "Next" : "Submit";

  return (
    <Formik
      initialValues={{
        recommendationScore: 10,
        feedbackCategory: "",
        website: {
          visitGoal: "",
          goalAccomplishRating: "",
          feedbackComments: "",
        },
        product: {
          category: "",
          feedbackComments: "",
        },
        general: {
          feedbackComments: "",
        },
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        onSubmit(values);
      }}
      render={({ submitForm, setFieldTouched }) => (
        <Modal
          onOk={handleOK(submitForm, stepConfig.name, setFieldTouched)}
          onCancel={onCancel}
          title="Wizard Form Sample"
          okText={okText}
          visible={true}
        >
          <Form layout="vertical">{stepConfig.step()}</Form>
        </Modal>
      )}
    />
  );
};
