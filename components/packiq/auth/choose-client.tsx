"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.235.8.53:8080";

export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  logo: string | null;
}

export default function ChooseClient() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_URL}/clients`, { credentials: "include", headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load clients");
        return res.json();
      })
      .then((data: Client[]) => {
        setClients(data ?? []);
        if (data?.length === 1) setSelectedId(data[0].id);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load clients");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedClient = clients.find((c) => c.id === selectedId);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setConfirming(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_URL}/clients/select`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ clientId: selectedId }),
      });
      if (!res.ok) throw new Error("Failed to select client");
      setDialogOpen(false);
      router.push("/auth/auth-complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to select client");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Card>
          <div className="flex flex-col items-center gap-2 text-center pt-6">
            <h1 className="text-2xl font-bold">Choose the client</h1>
            <p className="text-muted-foreground text-balance">
              Choose the client you want to access
            </p>
          </div>

          <CardContent className="pb-4">
            <form
              className=""
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedId) setDialogOpen(true);
              }}
            >
              <FieldGroup className="max-wsm">
                <Field className="py-10">
                  <FieldLabel htmlFor="small-form-role">Select Client</FieldLabel>
                  {loading && (
                    <p className="text-sm text-muted-foreground mb-2">Loading clients…</p>
                  )}
                  <Select
                    value={selectedId || undefined}
                    onValueChange={setSelectedId}
                    disabled={loading}
                  >
                    <SelectTrigger id="small-form-role">
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <DialogTrigger asChild>
                  <Button type="button" disabled={!selectedId || loading}>
                    Continue
                  </Button>
                </DialogTrigger>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
<DialogOverlay className="bg-gray-500/40" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Client Selection</DialogTitle>
            <DialogDescription>
              Please review the client details before continuing
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <Card className="flex align-top ">
              <div className="flex px-4 gap-8 align-top">
                <div className="w-1/4 p-0 align-top">
                  {selectedClient.logo ? (
                    <Image
                      src={selectedClient.logo}
                      alt={`${selectedClient.name} logo`}
                      width={206}
                      height={64}
                      priority
                    />
                  ) : (
                    <div className="flex h-16 w-[110px] items-center justify-center rounded border bg-muted text-muted-foreground">
                      {selectedClient.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="w-3/4 p-0 align-top">
                  <h3 className="text-lg font-bold py-4">{selectedClient.name}</h3>
                  <div>
                    <div className="font-bold">Industry:</div>
                    <div>{selectedClient.industry || "—"}</div>
                  </div>
                  <div className="pt-2">
                    <div className="font-bold">Location:</div>
                    <div>{selectedClient.location || "—"}</div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={confirming}
            >
              {confirming ? "Confirming…" : "Confirm & continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}