import React, { useState } from "react";
import { Button, Input } from "antd";
import { WizardFormSample } from "./WizardFormSample";
import "./App.css";
import { wizardFormSampleSteps as stepConfigs } from "./WizardFormSampleSteps";
import { IStepPageConfig } from "./WizardFormSteps";

const { TextArea } = Input;

function App() {
  const [
    initialStepConfig,
    setInitialStepConfig,
  ] = useState<IStepPageConfig | null>(null);
  const [feedback, setFeedback] = useState("");
  const startFeedbackWizard = () => {
    stepConfigs.reset();
    setInitialStepConfig(stepConfigs.nextStepConfig());
    setFeedback("");
  };
  const handleSubmit = (values: any) => {
    setInitialStepConfig(null);
    setFeedback(JSON.stringify(values, null, 2));
  };

  const handleCancel = () => {
    setInitialStepConfig(null);
  };

  return (
    <div className="app">
      <p>Click Feedback button to start a wizard form:</p>
      <Button onClick={startFeedbackWizard}> Feedback </Button>
      {initialStepConfig && (
        <WizardFormSample
          stepConfigs={stepConfigs}
          initialStepConfig={initialStepConfig}
          onSubmit={handleSubmit}
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
