import Wrapper from "@/components/layout/Wrapper";
import MainHome from "../app/(homes)/home_1/page";

export const metadata = {
  title: "Home",
  description: "BTravel",
};

export default function Home() {
  return (
    <>
      <Wrapper>
        <MainHome />
      </Wrapper>
    </>
  );
}
