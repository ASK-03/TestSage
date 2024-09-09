import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUserDetails, initOrUpdateUserData } from "@/lib/queries";

type Props = {};

const SignUpForm = async (props: Props) => {
  const authUser = await currentUser();
  if (!authUser) {
    return redirect("/sign-in");
  }
  console.log(authUser.publicMetadata.role);
  const user = await getAuthUserDetails();
  if (!user) {
    const user = await initOrUpdateUserData({
      email: authUser.emailAddresses[0].emailAddress,
    });
    return redirect(`/${user?.id}/generate-test`);
  }

  return redirect(`/${user?.id}/generate-test`);
};

export default SignUpForm;
