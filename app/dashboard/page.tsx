import DropzoneComponent from "@/components/Dropzone";
import TableWrapper from "@/components/table/TableWrapper";
import { FileType } from "@/typings";
import { auth } from "@clerk/nextjs";

async function getFiles(userId: string | null): Promise<FileType[]> {
    if (!userId) return [];
    
    try {
        const response = await fetch(`/api/files?userId=${userId}`);
        const files = await response.json();
        return files;
    } catch (error) {
        console.error("Error fetching files:", error);
        return [];
    }
}

const DashboardPage = async () => {
    const { userId } = auth();

    if (!userId) {
        return (
            <div className="flex items-center justify-center pt-10">
                <div className="text-center">
                    <h2 className="text-xl font-bold">Please sign in to view your files</h2>
                </div>
            </div>
        );
    }

    const skeletonFiles = await getFiles(userId);

    return (
        <div className="border-t">
            <DropzoneComponent />
            <section className="container space-y-5 mt-10">
                <h2 className="font-bold">All Files</h2>
                <div>
                    <TableWrapper skeletonFiles={skeletonFiles} />
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
