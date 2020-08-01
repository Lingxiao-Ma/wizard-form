import { WizardFormSteps, StepOptions } from "./WizardFormSteps";

test("Test simple steps", () => {
  const steps = new WizardFormSteps([() => 1, () => 2, () => 3]);
  expect(steps.hasNext()).toBe(true);
  expect(steps.nextStep()!()).toEqual(1);
  expect(steps.hasNext()).toBe(true);
  expect(steps.nextStep()!()).toEqual(2);
  expect(steps.hasNext()).toBe(true);
  expect(steps.nextStep()!()).toEqual(3);
  expect(steps.hasNext()).toBe(false);
});

test("Test option steps", () => {
  const options = new Map();
  options.set("optionA", new WizardFormSteps([() => 1, () => 2, () => 3]));
  options.set("optionB", new WizardFormSteps([() => 11, () => 12, () => 13]));
  const stepOptions = new StepOptions(options);
  stepOptions.select("optionB");

  const steps = new WizardFormSteps([() => 1, () => 2, stepOptions, () => 3]);
  expect(steps.nextStep()!()).toEqual(1);
  expect(steps.nextStep()!()).toEqual(2);

  expect(steps.nextStep()!()).toEqual(11);
  expect(steps.nextStep()!()).toEqual(12);
  expect(steps.nextStep()!()).toEqual(13);

  expect(steps.nextStep()!()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});

test("Test option steps - option step as last step", () => {
  const options = new Map();
  options.set("optionA", new WizardFormSteps([() => 1, () => 2, () => 3]));
  options.set("optionB", new WizardFormSteps([() => 11, () => 12, () => 13]));
  const stepOptions = new StepOptions(options);
  stepOptions.select("optionB");

  const steps = new WizardFormSteps([() => 1, () => 2, stepOptions]);
  expect(steps.nextStep()!()).toEqual(1);
  expect(steps.nextStep()!()).toEqual(2);

  expect(steps.nextStep()!()).toEqual(11);
  expect(steps.nextStep()!()).toEqual(12);
  expect(steps.nextStep()!()).toEqual(13);

  expect(steps.hasNext()).toBe(false);
});

test("Test option steps - option select", () => {
  const options = new Map();
  options.set("optionA", new WizardFormSteps([() => 1, () => 2, () => 3]));
  options.set("optionB", new WizardFormSteps([() => 11, () => 12, () => 13]));
  const stepOptions = new StepOptions(options);

  const steps = new WizardFormSteps([() => 1, () => 2, stepOptions, () => 3]);
  expect(steps.nextStep()!()).toEqual(1);
  expect(steps.nextStep()!()).toEqual(2);

  expect(steps.hasNext()).toBe(true); // option unselected
  expect(() => steps.nextStep()).toThrow();
  stepOptions.select("optionB");
  expect(steps.nextStep()!()).toEqual(11);
  expect(steps.nextStep()!()).toEqual(12);
  expect(steps.nextStep()!()).toEqual(13);
  expect(steps.nextStep()!()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});

const createSteps = () => {
  const embededOptions = new Map();
  embededOptions.set(
    "embededOptionA",
    new WizardFormSteps([() => 1, () => 2, () => 3])
  );
  embededOptions.set(
    "embededOptionB",
    new WizardFormSteps([() => 111, () => 112, () => 113])
  );
  const embededStepOptions = new StepOptions(embededOptions);
  embededStepOptions.select("embededOptionB");

  const options = new Map();
  options.set("optionA", new WizardFormSteps([() => 1, () => 2, () => 3]));
  options.set(
    "optionB",
    new WizardFormSteps([() => 11, embededStepOptions, () => 13])
  );
  const stepOptions = new StepOptions(options);
  stepOptions.select("optionB");

  return new WizardFormSteps([() => 1, () => 2, stepOptions, () => 3]);
};

test("Test option steps - optionStep in optionStep", () => {
  const steps = createSteps();

  expect(steps.nextStep()!()).toEqual(1);
  expect(steps.nextStep()!()).toEqual(2);

  expect(steps.nextStep()!()).toEqual(11);

  expect(steps.nextStep()!()).toEqual(111);
  expect(steps.nextStep()!()).toEqual(112);
  expect(steps.nextStep()!()).toEqual(113);

  expect(steps.nextStep()!()).toEqual(13);

  expect(steps.nextStep()!()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});

test("Test reset", () => {
  const steps = createSteps();

  expect(steps.nextStep()!()).toEqual(1);
  expect(steps.nextStep()!()).toEqual(2);

  expect(steps.nextStep()!()).toEqual(11);

  expect(steps.nextStep()!()).toEqual(111);
  expect(steps.nextStep()!()).toEqual(112);
  expect(steps.nextStep()!()).toEqual(113);

  expect(steps.nextStep()!()).toEqual(13);

  expect(steps.nextStep()!()).toEqual(3);

  expect(steps.hasNext()).toBe(false);

  steps.reset();

  expect(steps.hasNext()).toBe(true);

  expect(steps.nextStep()!()).toEqual(1);
  expect(steps.nextStep()!()).toEqual(2);

  expect(steps.nextStep()!()).toEqual(11);

  expect(steps.nextStep()!()).toEqual(111);
  expect(steps.nextStep()!()).toEqual(112);
  expect(steps.nextStep()!()).toEqual(113);

  expect(steps.nextStep()!()).toEqual(13);

  expect(steps.nextStep()!()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});
