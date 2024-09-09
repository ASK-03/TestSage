"use client";

import Loading from "@/components/global/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLLM } from "@/hooks/use-llm";
import React, { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";

type TestCase = {
  testCaseId: string;
  testCaseDescription: string;
  preConditions: string;
  testSteps: string[];
  expectedResult: string;
};

type FormValues = {
  context: string;
  images: FileList;
};

const Functionality = (props: {}) => {
  const [images, setImages] = useState<File[]>([]);
  const { generateInstructions, loading, data, error } = useLLM();
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>();

  // Watch the images field
  const watchedImages = watch("images");

  const onSubmit = async (formData: FormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("context", formData.context);
    Array.from(watchedImages).forEach((file) => {
      formDataToSend.append("images", file);
    });

    await generateInstructions(formDataToSend);
  };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  React.useEffect(() => {
    if (data) {
      console.log("Data received:", data); // Debugging line
    }
  }, [data]);

  const parsedData = data ? (JSON.parse(data.message) as TestCase[]) : [];

  return (
    <div className="!bg-transparent !shadow-none mx-auto w-[90%] sm:w-[60%] min-w-[300px] mb-10">
      <Card className="container">
        <CardHeader>
          <CardTitle>Generate Test Cases</CardTitle>
          <CardDescription>
            Provide the necesssary information below to generate test cases!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                Context <span className="text-sm font-light">(Optional)</span>
              </label>
              <Controller
                name="context"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea
                    placeholder="Add additional instructions or context (optional)..."
                    {...field}
                    className="w-full !bg-primary-background"
                  />
                )}
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                Upload Screenshots
              </label>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setImages(Array.from(e.target.files));
                        setValue("images", e.target.files);
                      }
                    }}
                    className="sm:w-fit w-full !bg-primary-background"
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              className={cn(
                "mt-4",
                images.length === 0 ? "bg-muted-foreground" : "bg-primary"
              )}
            >
              {!loading ? "Describe Testing Instructions" : <Loading />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {parsedData.length > 0 &&
        parsedData.map((testData, index) => (
          <Card key={index} className="my-4">
            <CardHeader>
              <CardTitle>{testData.testCaseId}</CardTitle>
              <CardDescription>
                <ReactMarkdown>{testData.testCaseDescription}</ReactMarkdown>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="pre-conditions">
                <h1 className="text-xl font-bold mb-2">Pre-conditions</h1>
                <p className="ml-3">
                  <ReactMarkdown>{testData.preConditions}</ReactMarkdown>
                </p>
              </div>
              <div className="steps">
                <h1 className="text-xl font-bold mb-2">Test Steps:</h1>
                <ol className="ml-3 flex flex-col gap-1">
                  {testData.testSteps.map((step, stepIndex) => (
                    <li className="flex" key={stepIndex}>
                      <Dot size={24} className="mr-1 text-primary" />
                      <ReactMarkdown>{step}</ReactMarkdown>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="results">
                <h1 className="text-xl font-bold mb-2">Expected Result</h1>
                <p className="ml-3">
                  <ReactMarkdown>{testData.expectedResult}</ReactMarkdown>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default Functionality;
