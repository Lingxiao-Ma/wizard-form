import React from "react";
import { Form, Input, Radio, Select } from "formik-antd";
import { WizardFormSteps, StepOptions } from "./WizardFormSteps";
import { FormRate } from "./Rate";

const { Option } = Select;
const { TextArea } = Input;

export const RecommendationScore = () => {
  return (
    <Form.Item
      label="How likely are you to recommend Cole Haan to a friend or colleague?"
      name="recommendationScore"
    >
      <FormRate name="recommendationScore" count={10} defaultValue={5} />
    </Form.Item>
  );
};

export const createFeedbackCategory = (stepOptions: StepOptions) => () => {
  const handleChange = (value: string) => {
    stepOptions.select(value);
  };

  return (
    <Form.Item
      label="Please choose a category you would like to leave feedback about."
      name="feedbackCategory"
    >
      <div>This is a dynamic step branch</div>
      <Select
        name="feedbackCategory"
        onChange={handleChange}
        placeholder="Your Choice"
      >
        <Option value="website">Our WebSite</Option>
        <Option value="product">Our Product</Option>
        <Option value="general">General</Option>
      </Select>
    </Form.Item>
  );
};

export const WebSiteVisitGoal = () => {
  return (
    <Form.Item
      label="What was your goal for todays visit to ColeHaan.com?"
      name="website.visitGoal"
    >
      <Select name="website.visitGoal">
        <Option value="Browse new arrivals">Browse new arrivals</Option>
        <Option value="Find a specific style">Find a specific style</Option>
        <Option value="Browse sales items">Browse sales items</Option>
        <Option value="Contact customer service">
          Contact customer service
        </Option>
        <Option value="Return or exchange an item">
          Return or exchange an item
        </Option>
      </Select>
    </Form.Item>
  );
};

export const WebSiteGoalAccomplishRating = () => {
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  return (
    <Form.Item
      label="How easy was it to accomplish that goal?"
      name="website.goalAccomplishRating"
    >
      <Radio.Group name="website.goalAccomplishRating">
        <Radio
          style={radioStyle}
          name="website.goalAccomplishRating"
          value="Very Difficult"
        >
          Very Difficult
        </Radio>
        <Radio
          style={radioStyle}
          name="website.goalAccomplishRating"
          value="Difficult"
        >
          Difficult
        </Radio>
        <Radio
          style={radioStyle}
          name="website.goalAccomplishRating"
          value="Not Difficult nor Easy"
        >
          Not Difficult nor Easy
        </Radio>
        <Radio
          style={radioStyle}
          name="website.goalAccomplishRating"
          value="Easy"
        >
          Easy
        </Radio>
        <Radio
          style={radioStyle}
          name="website.goalAccomplishRating"
          value="Very Easy"
        >
          Very Easy
        </Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export const ProductCategory = () => {
  return (
    <Form.Item
      label="What category would you like to leave feedback about?"
      name="product.category"
    >
      <Select name="product.category">
        <Option value="Footwear">Footwear</Option>
        <Option value="Outerwear">Outerwear</Option>
        <Option value="Bags">Bags</Option>
        <Option value="Others">Others</Option>
      </Select>
    </Form.Item>
  );
};

export const createFeedback = (name: string) => () => {
  return (
    <Form.Item label="Tell us what you think." name={name}>
      <TextArea name={name} />
    </Form.Item>
  );
};

export const WebSiteFeedback = createFeedback("website.feedbackComments");
export const GeneralFeedback = createFeedback("general.feedbackComments");
export const ProductFeedback = createFeedback("product.feedbackComments");

const createRootSteps = (): WizardFormSteps => {
  const feedbackOptions = new Map();
  feedbackOptions.set(
    "website",
    new WizardFormSteps([
      { name: "website.visitGoal", step: WebSiteVisitGoal },
      {
        name: "website.goalAccomplishRating",
        step: WebSiteGoalAccomplishRating,
      },
      { name: "website.feedbackComments", step: WebSiteFeedback },
    ])
  );
  feedbackOptions.set(
    "product",
    new WizardFormSteps([
      { name: "product.category", step: ProductCategory },
      { name: "product.feedbackComments", step: ProductFeedback },
    ])
  );
  feedbackOptions.set(
    "general",
    new WizardFormSteps([
      { name: "general.feedbackComments", step: GeneralFeedback },
    ])
  );

  const feedbackStepOptions = new StepOptions(feedbackOptions);
  return new WizardFormSteps([
    { name: "recommendationScore", step: RecommendationScore },
    {
      name: "feedbackCategory",
      step: createFeedbackCategory(feedbackStepOptions),
    },
    { name: "feedbackStepOptions", step: feedbackStepOptions },
  ]);
};

export const wizardFormSampleSteps = createRootSteps();
