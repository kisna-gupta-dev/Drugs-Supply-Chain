import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useContract } from "@/hooks/useContract";

export default function CheckRole() {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("MANUFACTURER_ROLE");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const { getContractRead } = useContract("handlingaddresses");

  const checkRoleFromContract = async () => {
    try {
      if (!address) return;

      const contract = await getContractRead();
      console.log("Checking role:", role, "for address:", address);
      const result = await contract.checkRole(role, address);
      console.log("Role check result:", result);
      setIsValid(result);
    } catch (err) {
      console.error("Role check error:", err);
      setIsValid(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Role Checker</h1>
        <p className="text-muted-foreground">Enter an address and choose a role to verify</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Check Address Role</CardTitle>
            <CardDescription>Check if an address holds a specific role in the contract</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Inputs */}
            <div className="flex flex-col gap-4">

              <Input
                placeholder="Enter address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Select onValueChange={setRole} defaultValue="MANUFACTURER_ROLE">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUFACTURER_ROLE">Manufacturer</SelectItem>
                  <SelectItem value="DISTRIBUTOR_ROLE">Distributor</SelectItem>
                  <SelectItem value="RETAILER_ROLE">Retailer</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={checkRoleFromContract}>Check Role</Button>
            </div>

            {/* Result */}
            {isValid !== null && (
              <div className="pt-4">
                {isValid ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                    <ShieldCheck className="text-green-600" />
                    <Badge className="bg-green-600 text-white">
                      {role.replace("_ROLE", "")} — CONFIRMED
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10">
                    <ShieldAlert className="text-red-600" />
                    <Badge className="bg-red-600 text-white">
                      NOT A {role.replace("_ROLE", "")}
                    </Badge>
                  </div>
                )}
              </div>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
