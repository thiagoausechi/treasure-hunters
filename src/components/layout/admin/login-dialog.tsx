"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AdminLoginDialog() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("username") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      name,
      password,
    });

    if (result?.ok && !result?.error) router.push("/admin");
    else setError("Credenciais inválidas. Tente novamente.");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Área Administrativa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Entrar como Administrador</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" name="username" type="text" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Entrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
