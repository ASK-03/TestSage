export type TestCase = {
  testId: string;
  testDescription: string;
  preCondition: string;
  testSteps: string[];
  expectedResults: string;
};
