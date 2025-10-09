import NextImage from "next/image";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import Title from "public/assets/img/title.png";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col px-4">
      <header className="shrink-0">
        <div className="flex justify-center py-4">
          <NextLink href="/">
            <NextImage src={Title} alt="Treasure Hunters" />
          </NextLink>
        </div>
      </header>

      {children}
    </div>
  );
}
