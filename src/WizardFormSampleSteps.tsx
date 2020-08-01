import React from "react";
import { Form, Input, Radio, Rate, Select } from "formik-antd";
import { WizardFormSteps, StepOptions } from "./WizardFormSteps";

const { Option } = Select;
const { TextArea } = Input;

export const RecommendationScore = () => {
  return (
    <Form.Item
      label="How likely are you to recommend Cole Haan to a friend or colleague?"
      name="recommendationScore"
    >
      <Rate name="recommendationScore" />
    </Form.Item>
  );
};

export const FeedbackCategory = (stepOptions: StepOptions) => () => {
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
      name="webSite.visitGoal"
    >
      <Select name="webSite.visitGoal">
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
      name="webSite.goalAccomplishRating"
    >
      <Radio.Group name="webSite.goalAccomplishRating">
        <Radio
          style={radioStyle}
          name="webSite.goalAccomplishRating"
          value="Very Difficult"
        >
          Very Difficult
        </Radio>
        <Radio
          style={radioStyle}
          name="webSite.goalAccomplishRating"
          value="Difficult"
        >
          Difficult
        </Radio>
        <Radio
          style={radioStyle}
          name="webSite.goalAccomplishRating"
          value="Not Difficult nor Easy"
        >
          Not Difficult nor Easy
        </Radio>
        <Radio
          style={radioStyle}
          name="webSite.goalAccomplishRating"
          value="Easy"
        >
          Easy
        </Radio>
        <Radio
          style={radioStyle}
          name="webSite.goalAccomplishRating"
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
      className="Form-item"
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

export const WebSiteFeedback = createFeedback("webSite.feedbackComments");
export const GeneralFeedback = createFeedback("general.feedbackComments");
export const ProductFeedback = createFeedback("product.feedbackComments");

const createRootSteps = (): WizardFormSteps => {
  const options = new Map();
  options.set(
    "website",
    new WizardFormSteps([
      WebSiteVisitGoal,
      WebSiteGoalAccomplishRating,
      WebSiteFeedback,
    ])
  );
  options.set(
    "product",
    new WizardFormSteps([ProductCategory, ProductFeedback])
  );
  options.set("general", new WizardFormSteps([GeneralFeedback]));

  const stepOptions = new StepOptions(options);
  return new WizardFormSteps([
    RecommendationScore,
    FeedbackCategory(stepOptions),
    stepOptions,
  ]);
};

export const wizardFormSampleSteps = createRootSteps();
