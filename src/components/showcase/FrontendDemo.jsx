import { Layout, Type } from "lucide-react";
import { motion } from "framer-motion";

export const FrontendDemo = () => {
    return (
        <div className="bg-white/[0.03] rounded-xl shadow-xl border border-line overflow-hidden relative h-64 flex items-center justify-center select-none">
            <div className="absolute inset-0 grid grid-cols-6 gap-2 opacity-[0.03] pointer-events-none">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="bg-ink rounded-sm h-full w-full" />
                ))}
            </div>

            <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-8 bg-ink-2 p-3 rounded-xl shadow-lg border border-line z-10 flex flex-col items-center gap-2"
            >
                <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Palette</div>
                <div className="flex gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-accent shadow-sm" />
                    <div className="w-5 h-5 rounded-full bg-ink border border-line shadow-sm" />
                    <div className="w-5 h-5 rounded-full bg-fg shadow-sm" />
                </div>
            </motion.div>

            <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 right-8 bg-ink-2 px-4 py-2 rounded-xl shadow-lg border border-line z-10 flex items-center gap-3"
            >
                <div className="bg-white/[0.06] p-1.5 rounded-md">
                    <Type size={16} className="text-fg/80" />
                </div>
                <div>
                    <div className="font-bold text-fg text-sm">Inter Font</div>
                    <div className="text-[10px] text-muted">Typography System</div>
                </div>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-ink-2 p-4 rounded-2xl shadow-2xl border border-line w-64 relative z-0"
            >
                <div className="h-32 bg-gradient-to-br from-accent to-ink-2 rounded-xl mb-4 relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Layout className="text-white/80" size={32} />
                    </div>
                    <motion.div
                        className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        animate={{ left: ["100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <div className="absolute top-2 right-2 bg-ink/70 backdrop-blur-md text-accent text-[10px] px-2 py-0.5 rounded-full font-medium">
                        New
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="h-4 bg-white/[0.06] rounded-md w-2/3" />
                        <div className="h-4 bg-accent/10 rounded-md w-8" />
                    </div>
                    <div className="h-2 bg-white/10 rounded-md w-full" />
                    <div className="h-2 bg-white/10 rounded-md w-5/6" />

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-line">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full bg-white/[0.06] border-2 border-ink-2 flex items-center justify-center">
                                    <div className="w-full h-full rounded-full bg-white/10" />
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-7 px-3 bg-accent text-on-accent rounded-full text-[10px] font-bold"
                        >
                            View Details
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};