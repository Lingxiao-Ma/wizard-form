export type Step = StepPage | StepOptions;
export interface IStepConfig {
  name: string; // match to formik state,
  step: Step;
}

export interface IStepPageConfig {
  name: string;
  step: StepPage;
}

export type StepPage = () => React.ReactNode;
interface IStepIterator {
  hasNext(): boolean;
  nextStepConfig(): IStepPageConfig | null;
  reset(): void;
}
export class WizardFormSteps implements IStepIterator {
  protected _stepConfigs: IStepConfig[];
  private _currentStep: number;

  constructor(stepConfigs: IStepConfig[]) {
    this._stepConfigs = stepConfigs;
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
    for (let stepConfig of this._stepConfigs) {
      if (this.isStepOptions(stepConfig.step)) {
        const stepOption = stepConfig.step as StepOptions;
        stepOption.reset();
      }
    }
  }

  hasNext(): boolean {
    if (this._currentStep < this._stepConfigs.length - 1) {
      return true;
    }

    if (this._currentStep === this._stepConfigs.length - 1) {
      if (this.isStepOptions(this._stepConfigs[this._currentStep].step)) {
        const switchStep = this._stepConfigs[this._currentStep]
          .step as StepOptions;
        return switchStep.hasNext();
      }

      // the last step is StepPage
      return true;
    }

    return false;
  }

  nextStepConfig(): IStepPageConfig | null {
    if (!this.isStepOptions(this._stepConfigs[this._currentStep].step)) {
      const stepConfig = this._stepConfigs[this._currentStep];
      this._currentStep++;
      return stepConfig as IStepPageConfig;
    }

    const stepOptions = this._stepConfigs[this._currentStep]
      .step as StepOptions;
    if (stepOptions.hasNext()) {
      return stepOptions.nextStepConfig();
    }

    this._currentStep++; // iterate to next
    return this.nextStepConfig();
  }
}

export class StepOptions implements IStepIterator {
  private _options: Map<string, WizardFormSteps>;
  private _selectedKey: string | undefined;
  private _defaultKey?: string;
  constructor(options: Map<string, WizardFormSteps>, defaultKey?: string) {
    this._options = options;
    if (defaultKey) {
      this._selectedKey = defaultKey;
      this._defaultKey = defaultKey;
    }
  }

  private selectedSteps(): WizardFormSteps | null {
    if (!this._selectedKey) {
      return null;
    }
    return this._options.get(this._selectedKey) as WizardFormSteps;
  }

  reset() {
    this._selectedKey = this._defaultKey;
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

  nextStepConfig(): IStepPageConfig | null {
    const steps = this.selectedSteps();
    if (!steps) {
      throw new Error("Step Options should be configured first");
    }
    return steps.nextStepConfig();
  }
}
