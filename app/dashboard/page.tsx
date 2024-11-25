import DropzoneComponent from "@/components/Dropzone";
import TableWrapper from "@/components/table/TableWrapper";
import { FileType } from "@/typings";
import { auth } from '@clerk/nextjs/server'

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
    const { userId } = await auth();

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Sign In</h2>
                    <p className="text-gray-600 dark:text-gray-400">Sign in to access your files and storage.</p>
                </div>
            </div>
        );
    }

    const skeletonFiles = await getFiles(userId);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Your Files
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload, manage and share your files securely
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Upload Files
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Drag and drop or click to upload
                        </div>
                    </div>
                    <DropzoneComponent />
                </div>

                {/* Files Table Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            All Files
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {skeletonFiles.length} {skeletonFiles.length === 1 ? 'file' : 'files'}
                        </div>
                    </div>
                    <TableWrapper skeletonFiles={skeletonFiles} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
