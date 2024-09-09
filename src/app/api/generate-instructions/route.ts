import { NextRequest, NextResponse } from "next/server";
import model from "@/lib/llm";

async function fileToGenerativePart(file: File, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(await file.arrayBuffer()).toString("base64"),
      mimeType,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const context = formData.get("context") as string;
    const files = formData.getAll("images") as File[];

    // Convert each file directly to the Generative API format
    const parts = await Promise.all(
      files.map(async (file) => {
        const mimeType = file.type;
        return fileToGenerativePart(file, mimeType);
      })
    );

    const prompt: string = `
        Please create a set of test cases in JSON format for the following software feature, You are given screenshots and a context: 
        Context: ${context ? context : "See images to get the context"}.
        Screenshots: ${files.map((file) => file.name).join(", ")}

        For example:
            Feature: User registration on a social media platform
            Feature: Adding items to a shopping cart and checking out
            Feature: Searching for a specific product on an e-commerce website
            Feature: Uploading a file to a cloud storage service
        Include the following information for each test case:
        1. Test Case ID: A unique identifier for the test case.
        2. Test Case Description: A clear and concise description of what the test case is designed to verify.
        3. Pre-Conditions: Any conditions that must be met before running the test case (e.g., specific user roles, data setup).
        4. Test Steps: A detailed list of steps that the tester must follow to execute the test case.
        5. Expected Result: The expected outcome of the test case based on successful execution

        Example JSON format:

        [
            {
                "testCaseId": "TC-01",
                "testCaseDescription": "Verify user registration with valid email and password",
                "preConditions": "None",
                "testSteps": [
                "Open the registration page",
                "Enter a valid email address in the email field",
                "Enter a valid password in the password field",
                "Click the 'Register' button"
                ],
                "expectedResult": "The user should be successfully registered and redirected to the login page or a welcome page."
            },
            {
                "testCaseId": "TC-02",
                "testCaseDescription": "Verify user registration with an existing email address",
                "preConditions": "A user account with the same email address already exists.",
                "testSteps": [
                "Open the registration page",
                "Enter the existing email address in the email field",
                "Enter a valid password in the password field",
                "Click the 'Register' button"
                ],
                "expectedResult": "The application should display an error message indicating that the email address is already in use."
            },
            // ... more test cases ...
        ]

        Give only the response in JSON format only. Try to be as descriptive as possible. The strings can be in markdown format. Highlight the important parts of the test cases.
    `;

    const result = await model.generateContent([prompt, ...parts]);

    // Send API response back to the client
    return NextResponse.json({
      message: result.response
        .text()
        .replace(/```json|```/g, "")
        .trim(),
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error processing images" },
      { status: 500 }
    );
  }
}
