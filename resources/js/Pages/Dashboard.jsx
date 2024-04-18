import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header="Home"
        >
            <Head title="Home" />

            <div className="relative">
                <div className="bg-white text-slate-700 ring-1 ring-slate-700 ring-opacity-5 shadow px-6 py-4 rounded-md">
                    You're logged in!
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
