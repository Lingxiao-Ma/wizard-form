import React, { useState } from "react";
import { Modal } from "antd";
import { Form } from "formik-antd";
import { Formik } from "formik";

export const WizardFormSample = (props: any) => {
  const { steps, initalStep, onOK, ...rest } = props;

  const [step, setStep] = useState({ stepPage: initalStep });
  const gotoNext = () => {
    setStep({ stepPage: steps.nextStep() });
  };
  const { stepPage } = step;

  const handleOK = (submitForm: any) => {
    return steps.hasNext() ? gotoNext : submitForm;
  };
  const okText = steps.hasNext() ? "Next" : "Submit";

  return (
    <Formik
      initialValues={{
        recommendationScore: 10,
        feedbackCategory: null,
        webSite: {
          visitGoal: null,
          goalAccomplishRating: null,
          feedbackComments: "",
        },
        product: {
          category: null,
          feedbackComments: "",
        },
        general: {
          feedbackComments: "",
        },
      }}
      onSubmit={(values) => {
        onOK(values);
      }}
      render={({ submitForm }) => (
        <Modal
          onOk={handleOK(submitForm)}
          title="Wizard Form Sample"
          okText={okText}
          {...rest}
        >
          <Form layout="vertical">{stepPage()}</Form>
        </Modal>
      )}
    />
  );
};
