"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { bookmarkTest, removeBookmark } from "@/lib/queries";
import { Bookmark, Dot } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  testData: {
    testId: string;
    testDescription: string;
    preCondition: string;
    testSteps: string[];
    expectedResults: string;
  };
  userId: string;
  isBookmarked?: boolean;
  testIdProp?: string;
};

const TestCard = ({
  testData,
  userId,
  isBookmarked = false,
  testIdProp,
}: Props) => {
  // Manage the bookmark state locally
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isMounted, setIsMounted] = useState(false);
  const [testId, setTestId] = useState<string | null>(testIdProp || null);

  const router = useRouter();

  useEffect(() => {
    async function f() {
      if (bookmarked) {
        // Bookmark the test case
        const response = await bookmarkTest(testData, userId);
        setTestId(response.id);
      } else {
        // Remove the bookmark
        await removeBookmark(testId as string);
        setTestId(null);
        router.refresh();
      }
    }
    if (isMounted) {
      f();
    } else {
      setIsMounted(true);
    }
  }, [bookmarked]);

  const toggleBookmark = () => {
    // Toggle the bookmark state
    setBookmarked((prevBookmarked) => !prevBookmarked);
  };

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>{testData.testId}</div>
          {!bookmarked && (
            <Bookmark
              onClick={toggleBookmark}
              size={24}
              className="text-primary cursor-pointer"
            />
          )}
          {bookmarked && (
            <Bookmark
              onClick={toggleBookmark}
              size={24}
              className="fill-primary cursor-pointer"
            />
          )}
        </CardTitle>
        <CardDescription>
          <ReactMarkdown>{testData.testDescription}</ReactMarkdown>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="pre-conditions">
          <h1 className="text-xl font-bold mb-2">Pre-conditions</h1>
          <p className="ml-3">
            <ReactMarkdown>{testData.preCondition}</ReactMarkdown>
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
          <div className="ml-3">
            <ReactMarkdown>{testData.expectedResults}</ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCard;
