import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Door } from "@/lib/Icon";
import { Button } from "@/components/ui/Button";

interface DisconnectedProps {
    button?: boolean;
}

export default function Disconnected({ button }: DisconnectedProps) {
    if (button) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl cursor-pointer bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white shadow-lg"
                >
                    <Door />
                </button>
            </motion.div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Button
                variant="ghost"
                fullWidth
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-danger hover:bg-danger-soft"
            >
                Se déconnecter
            </Button>
        </motion.div>
    );
}