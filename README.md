# Overview

Collect feedback with a step by step wizard form, present one question at a time. Build on top of [formik](https://github.com/formium/formik) and [formik-antd](https://github.com/jannikbuschke/formik-antd). </br>
The component is still under development.

## Interfaces

### StepPage

`StepPage` is the basic interface to render a question in a step.

```javascript
StepPage = () => React.ReactNode;
```

### Support branches with StepOptions

`StepOptions` keep multiple question branches, each branch is an embeded `WizardFormSteps`. the active branch can be dynamically selected in run time according to user's input.

### WizardFormSteps

`WizardFormSteps` implements `IStepIterator` to iterate all steps.

```javascript
interface IStepIterator {
  hasNext(): boolean;
  nextStepConfig(): IStepPageConfig | null;
  reset(): void;
}
```

## Run Demo

Make sure you have [NodeJs](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed, open the root folder, `cd ${Root}`, run `yarn install & yarn start`, open [http://localhost:3000](http://localhost:3000) to view it in the browser. </br></br>
