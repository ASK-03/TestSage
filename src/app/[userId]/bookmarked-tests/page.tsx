import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBookmarkedTests } from "@/lib/queries";
import { Ghost } from "lucide-react";
import React from "react";
import TestCard from "../_components/TestCard";

type Props = {
  params: {
    userId: string;
  };
};

const page = async ({ params }: Props) => {
  const response = await getBookmarkedTests(params.userId);
  return (
    <div className="!bg-transparent !shadow-none mx-auto w-[90%] sm:w-[60%] min-w-[300px] mb-10">
      <Card>
        <CardHeader>
          <CardTitle>Bookmarked Tests</CardTitle>
          <CardDescription>
            Here are the tests you have bookmarked.
          </CardDescription>
        </CardHeader>
        {response.length > 0 ? (
          <CardContent>
            {response.map((data, index) => {
              const testData = {
                testId: data.testId,
                testDescription: data.testDescription,
                preCondition: data.preCondition,
                testSteps: data.testSteps,
                expectedResults: data.expectedResults,
              };
              return (
                <TestCard
                  key={index}
                  testData={testData}
                  userId={params.userId}
                  isBookmarked={true}
                  testIdProp={data.id}
                />
              );
            })}
          </CardContent>
        ) : (
          <CardContent className="w-full p-0 flex flex-col items-center justify-center align-middle gap-2 text-muted-foreground/80 mb-10">
            <Ghost className="w-16 h-16 animate-bounce" />
            Nothing to show here
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default page;
