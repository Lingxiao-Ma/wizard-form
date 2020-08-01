import { WizardFormSteps, StepOptions, Step } from "./WizardFormSteps";

const createSteps = (steps: Step[]) => {
  const stepconfigs = steps.map((step, index) => {
    return { name: `key${index}`, step };
  });
  return new WizardFormSteps(stepconfigs);
};

test("Test simple steps", () => {
  const steps = new WizardFormSteps([
    { name: "key1", step: () => 1 },
    { name: "key2", step: () => 2 },
    { name: "key3", step: () => 3 },
  ]);
  expect(steps.hasNext()).toBe(true);
  expect(steps.nextStepConfig()!.step()).toEqual(1);
  expect(steps.hasNext()).toBe(true);
  expect(steps.nextStepConfig()!.step()).toEqual(2);
  expect(steps.hasNext()).toBe(true);
  expect(steps.nextStepConfig()!.step()).toEqual(3);
  expect(steps.hasNext()).toBe(false);
});

test("Test option steps", () => {
  const options = new Map();
  options.set("optionA", createSteps([() => 1, () => 2, () => 3]));
  options.set("optionB", createSteps([() => 11, () => 12, () => 13]));
  const stepOptions = new StepOptions(options);
  stepOptions.select("optionB");

  const steps = createSteps([() => 1, () => 2, stepOptions, () => 3]);
  expect(steps.nextStepConfig()!.step()).toEqual(1);
  expect(steps.nextStepConfig()!.step()).toEqual(2);

  expect(steps.nextStepConfig()!.step()).toEqual(11);
  expect(steps.nextStepConfig()!.step()).toEqual(12);
  expect(steps.nextStepConfig()!.step()).toEqual(13);

  expect(steps.nextStepConfig()!.step()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});

test("Test option steps - option step as last step", () => {
  const options = new Map();
  options.set("optionA", createSteps([() => 1, () => 2, () => 3]));
  options.set("optionB", createSteps([() => 11, () => 12, () => 13]));
  const stepOptions = new StepOptions(options);
  stepOptions.select("optionB");

  const steps = createSteps([() => 1, () => 2, stepOptions]);
  expect(steps.nextStepConfig()!.step()).toEqual(1);
  expect(steps.nextStepConfig()!.step()).toEqual(2);

  expect(steps.nextStepConfig()!.step()).toEqual(11);
  expect(steps.nextStepConfig()!.step()).toEqual(12);
  expect(steps.nextStepConfig()!.step()).toEqual(13);

  expect(steps.hasNext()).toBe(false);
});

test("Test option steps - option select", () => {
  const options = new Map();
  options.set("optionA", createSteps([() => 1, () => 2, () => 3]));
  options.set("optionB", createSteps([() => 11, () => 12, () => 13]));
  const stepOptions = new StepOptions(options);

  const steps = createSteps([() => 1, () => 2, stepOptions, () => 3]);
  expect(steps.nextStepConfig()!.step()).toEqual(1);
  expect(steps.nextStepConfig()!.step()).toEqual(2);

  expect(steps.hasNext()).toBe(true); // option unselected
  expect(() => steps.nextStepConfig()).toThrow();
  stepOptions.select("optionB");
  expect(steps.nextStepConfig()!.step()).toEqual(11);
  expect(steps.nextStepConfig()!.step()).toEqual(12);
  expect(steps.nextStepConfig()!.step()).toEqual(13);
  expect(steps.nextStepConfig()!.step()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});

const createOptionsInOptionsSteps = () => {
  const embededOptions = new Map();
  embededOptions.set(
    "embededOptionA",
    createSteps([() => 1, () => 2, () => 3])
  );
  embededOptions.set(
    "embededOptionB",
    createSteps([() => 111, () => 112, () => 113])
  );
  const embededStepOptions = new StepOptions(embededOptions);
  embededStepOptions.select("embededOptionB");

  const options = new Map();
  options.set("optionA", createSteps([() => 1, () => 2, () => 3]));
  options.set("optionB", createSteps([() => 11, embededStepOptions, () => 13]));
  const stepOptions = new StepOptions(options);
  stepOptions.select("optionB");

  return createSteps([() => 1, () => 2, stepOptions, () => 3]);
};

test("Test option steps - optionStep in optionStep", () => {
  const steps = createOptionsInOptionsSteps();

  expect(steps.nextStepConfig()!.step()).toEqual(1);
  expect(steps.nextStepConfig()!.step()).toEqual(2);

  expect(steps.nextStepConfig()!.step()).toEqual(11);

  expect(steps.nextStepConfig()!.step()).toEqual(111);
  expect(steps.nextStepConfig()!.step()).toEqual(112);
  expect(steps.nextStepConfig()!.step()).toEqual(113);

  expect(steps.nextStepConfig()!.step()).toEqual(13);

  expect(steps.nextStepConfig()!.step()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});

test("Test reset", () => {
  const steps = createOptionsInOptionsSteps();

  expect(steps.nextStepConfig()!.step()).toEqual(1);
  expect(steps.nextStepConfig()!.step()).toEqual(2);

  expect(steps.nextStepConfig()!.step()).toEqual(11);

  expect(steps.nextStepConfig()!.step()).toEqual(111);
  expect(steps.nextStepConfig()!.step()).toEqual(112);
  expect(steps.nextStepConfig()!.step()).toEqual(113);

  expect(steps.nextStepConfig()!.step()).toEqual(13);

  expect(steps.nextStepConfig()!.step()).toEqual(3);

  expect(steps.hasNext()).toBe(false);

  steps.reset();

  expect(steps.hasNext()).toBe(true);

  expect(steps.nextStepConfig()!.step()).toEqual(1);
  expect(steps.nextStepConfig()!.step()).toEqual(2);

  expect(steps.nextStepConfig()!.step()).toEqual(11);

  expect(steps.nextStepConfig()!.step()).toEqual(111);
  expect(steps.nextStepConfig()!.step()).toEqual(112);
  expect(steps.nextStepConfig()!.step()).toEqual(113);

  expect(steps.nextStepConfig()!.step()).toEqual(13);

  expect(steps.nextStepConfig()!.step()).toEqual(3);

  expect(steps.hasNext()).toBe(false);
});
