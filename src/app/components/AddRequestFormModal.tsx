export function AddRequestModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return null;


    function FormInput({ label, placeholder }: { label: string; placeholder: string }) {
        return (
            <div className="flex flex-col gap-2 text-start">
                <label className="text-foreground text-sm">{label}</label>
                <input
                    placeholder={placeholder}
                    className="border border-gray-200 h-12 px-5 rounded-full bg-white shadow-neo-light-concave text-foreground outline-none placeholder-gray-500"
                />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Add New Search Request
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // alert("Request submitted! (Add real logic here)");
                        onClose();
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <FormInput label="Name of Person" placeholder="e.g., John Doe" />
                    <FormInput label="Company Name" placeholder="e.g., Innovate Inc." />
                    <FormInput label="Email" placeholder="e.g., abc@gmail.com." />
                    <FormInput label="Industry Name" placeholder="e.g., Tech" />
                    <FormInput label="City" placeholder="e.g., San Francisco" />
                    <FormInput label="Country (Optional)" placeholder="e.g., USA" />
                    <FormInput label="LinkedIn URL (Optional)" placeholder="https://linkedin.com/in/..." />

                    <div className="lg:col-span-3 flex gap-4 justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-12 px-8 rounded-full border border-gray-300 text-foreground font-medium hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="h-12 px-8 bg-[#1B7FE6] text-white rounded-full font-semibold shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}