import NextImage from "next/image";
import NextLink from "next/link";
import Title from "public/assets/img/title.png";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="public-layout"
      className="mx-auto flex h-screen max-w-2xl flex-col px-4"
    >
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
