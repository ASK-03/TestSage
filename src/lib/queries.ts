"use server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import db from "./db";
import { User, UserBookmark } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return userData;
};

export const initOrUpdateUserData = async (data: Partial<User>) => {
  if (!data.email) return null;
  const user = await currentUser();
  if (!user) return null;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: { name: user.fullName },
    create: {
      id: uuidv4(),
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName,
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      role: "USER",
    },
  });

  return userData;
};

export const bookmarkTest = async (
  testData: Partial<UserBookmark>,
  userId: string
) => {
  try {
    const response = await db.userBookmark.create({
      data: {
        id: uuidv4(), // Unique ID for the bookmark
        testId: testData.testId || "", // Ensure this is unique
        userId: userId, // Connect to the existing user
        testDescription: testData.testDescription || "",
        preCondition: testData.preCondition || "",
        testSteps: testData.testSteps || [], // Ensure this is an array
        expectedResults: testData.expectedResults || "",
        timestamp: new Date(), // Current timestamp
      },
    });

    return response;
  } catch (error) {
    console.error("Error creating bookmark:", error);
    throw error; // Handle the error appropriately
  }
};

export const removeBookmark = async (bookmarkId: string) => {
  const response = await db.userBookmark.delete({
    where: {
      id: bookmarkId,
    },
  });

  return response;
};

export const getBookmarkedTests = async (userId: string) => {
  const bookmarks = await db.userBookmark.findMany({
    where: {
      userId: userId,
    },
  });

  return bookmarks;
};
