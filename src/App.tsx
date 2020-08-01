import React, { useState } from "react";
import { Button, Input } from "antd";
import { WizardFormSample } from "./WizardFormSample";
import "./App.css";
import { wizardFormSampleSteps as steps } from "./WizardFormSampleSteps";
import { StepPage } from "./WizardFormSteps";

const { TextArea } = Input;

type InitialStepType = {
  initialStep: StepPage | null;
};
function App() {
  const [wizardSteps, setWizardSteps] = useState<InitialStepType>({
    initialStep: null,
  });
  const [feedback, setFeedback] = useState("");
  const startFeedbackWizard = () => {
    steps.reset();
    setWizardSteps({ initialStep: steps.nextStep() });
    setFeedback("");
  };
  const handleOK = (values: any) => {
    setWizardSteps({
      initialStep: null,
    });
    setFeedback(JSON.stringify(values, null, 2));
  };

  const handleCancel = () => {
    setWizardSteps({
      initialStep: null,
    });
  };

  const { initialStep } = wizardSteps;

  return (
    <div className="app">
      <p>Click Feedback button to start a wizard form:</p>
      <Button onClick={startFeedbackWizard}> Feedback </Button>
      {initialStep && (
        <WizardFormSample
          steps={steps}
          initalStep={initialStep}
          visible={true}
          onOK={handleOK}
          onCancel={handleCancel}
        />
      )}
      <p>Feedback result:</p>
      <TextArea
        readOnly
        autoSize={{
          minRows: 2,
          maxRows: 16,
        }}
        value={feedback}
        className="feedback"
      />
    </div>
  );
}

export default App;
