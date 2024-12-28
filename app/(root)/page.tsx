import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();

  return (
    <>
      <h1 className="font-space-grotesk text-3xl font-black text-light-500">
        Welcome to the world of Next.js (Space Grotesk)
      </h1>
      {session && (
        <form
          className="px-10 pt-[100px]"
          action={async () => {
            "use server";
            await signOut({ redirectTo: ROUTES.SIGNIN });
          }}
        >
          <Button type="submit">Log Out</Button>
        </form>
      )}
    </>
  );
};

export default Home;
