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
import { cn } from "@/lib/utils";
import TestCard from "../_components/TestCard";
import { TestCase } from "@/lib/types";

type FormValues = {
  context: string;
  images: FileList;
};

type Props = {
  userId: string;
};

const Functionality = ({ userId }: Props) => {
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
    <div className="!bg-transparent !shadow-none mx-auto w-[90%] sm:w-[60%] min-w-[300px]">
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
                render={({}) => (
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
          <TestCard key={index} testData={testData} userId={userId} />
        ))}
    </div>
  );
};

export default Functionality;
