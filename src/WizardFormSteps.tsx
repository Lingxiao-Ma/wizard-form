type Step = StepPage | StepOptions;
export type StepPage = () => React.ReactNode;
interface IStepIterator {
  hasNext(): boolean;
  nextStep(): StepPage | null;
  reset(): void;
}
export class WizardFormSteps implements IStepIterator {
  protected _steps: Step[];
  private _currentStep: number;

  constructor(steps: Step[]) {
    this._steps = steps;
    this._currentStep = 0;
  }

  private isStepOptions(step: Step) {
    // @ts-ignore
    if (step._options) {
      // a hack way to test step is a StepOptions
      return true;
    }
  }

  reset() {
    this._currentStep = 0;
    for (let step of this._steps) {
      if (this.isStepOptions(step)) {
        const stepOption = step as StepOptions;
        stepOption.reset();
      }
    }
  }

  hasNext(): boolean {
    if (this._currentStep < this._steps.length - 1) {
      return true;
    }

    if (this._currentStep === this._steps.length - 1) {
      if (this.isStepOptions(this._steps[this._currentStep])) {
        const switchStep = this._steps[this._currentStep] as StepOptions;
        return switchStep.hasNext();
      }

      // the last step is StepPage
      return true;
    }

    return false;
  }

  nextStep(): StepPage | null {
    if (!this.isStepOptions(this._steps[this._currentStep])) {
      const stepPage = this._steps[this._currentStep] as StepPage;
      this._currentStep++;
      return stepPage;
    }

    const stepOptions = this._steps[this._currentStep] as StepOptions;
    if (stepOptions.hasNext()) {
      return stepOptions.nextStep();
    }

    this._currentStep++; // iterate to next
    return this.nextStep();
  }
}

export class StepOptions implements IStepIterator {
  private _options: Map<string, WizardFormSteps>;
  private _selectedKey: string | undefined;
  constructor(options: Map<string, WizardFormSteps>, defaultKey?: string) {
    this._options = options;
    if (defaultKey) {
      this._selectedKey = defaultKey;
    }
  }

  private selectedSteps(): WizardFormSteps | null {
    if (!this._selectedKey) {
      return null;
    }
    return this._options.get(this._selectedKey) as WizardFormSteps;
  }

  reset() {
    for (let step of this._options.values()) {
      step.reset();
    }
  }

  select(key: string) {
    if (this._options.has(key)) {
      this._selectedKey = key;
    }
  }

  hasNext() {
    const steps = this.selectedSteps();
    if (!steps) {
      return true;
    }
    return steps.hasNext();
  }

  nextStep(): StepPage | null {
    const steps = this.selectedSteps();
    if (!steps) {
      throw new Error("Step Options should be configured first");
    }
    return steps.nextStep();
  }
}
