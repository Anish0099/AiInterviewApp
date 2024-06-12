import { Button } from "/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex justify-center items-center gap-5 h-screen w-screen ">
      <h2 className="font-medium text-primary text-medium">Hello</h2>
      <Link href="/dashboard">
        <Button>Go to Dashboard for interview</Button>
      </Link>

    </div>
  );
}
